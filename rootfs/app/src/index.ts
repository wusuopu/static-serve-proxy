import express, { Request, Response } from 'express';
import program from 'commander'
import proxy from 'http-proxy-middleware'
import fs from 'fs-extra'
import _ from 'lodash'
import expressWinston from 'express-winston'
import winston from 'winston'
import path from 'path'

const app = express();
if ( process.env.NODE_ENV !== 'test'  ) {
  app.use(expressWinston.logger({
    transports: [ new winston.transports.Console() ],
    ignoredRoutes: ['/health_check'],
    meta: true,
    expressFormat: true
  }))
}


program
  .option('-d, --dir <dir>', '静态文件目录，默认为当前目录')
  .option('-p, --port <port>', 'http的端口3000', 3000)
  .option('-b, --bind <addr>', 'http的地址', '0.0.0.0')
  .option('-f, --config <config>', 'http-proxy-middleware 配置文件\n配置范例： [{"path": "/api", "proxy":{"target": "http://api/"}}]', 'proxy-config.json')
  .option('-i, --index <index.html>', '针对 react, vue 等前端框架若使用的是后端路由，则指定对应的 index.html 文件路径')

program.on('--help', function(){
  console.log('')
});
 

const main = () => {
  program.parse(process.argv);

  let proxyConfig = []
  if (program.config) {
    try {
      proxyConfig = JSON.parse(fs.readFileSync(program.config, 'utf8'))
    } catch (e) {
      proxyConfig = []
    }
  }

  if (!_.isArray(proxyConfig)) {
    proxyConfig = [proxyConfig]
  }

  let dir = path.resolve(program.dir || '.')
  app.use(express.static(dir, { index: ['index.html', 'index.htm'] }))
  if (program.index && fs.existsSync(program.index)) {
    app.use((__: Request, res: Response) => {
      res.sendFile(path.resolve(program.index))
    })
  }

  _.each(proxyConfig, (config) => {
    console.log(`proxy ${config.path} => ${config.proxy.target}`)
    app.use(config.path, proxy(config.proxy))
  })

  let port = parseInt(program.port, 10) || 3000
  let hostname = program.bind || '0.0.0.0'
  app.listen(port, hostname, () => {
    console.log(`server started at http://${hostname}:${port}`);
  });
}

if (require.main === module) {
  main()
}
export default app;
