FROM node:8-alpine

COPY ./rootfs/app/package.json ./rootfs/app/yarn.lock /app
RUN cd /app && yarn install && rm -rf /root/.cache /root/.npm /usr/local/share/.cache/yarn/

COPY ./rootfs/ /
WORKDIR /app

RUN yarn build

ENV PORT="3000" \
    BIND="0.0.0.0"

CMD ["yarn", "start"]
