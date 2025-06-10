ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS node-base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable


FROM node-base AS dependencies-env

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=bind,source=pnpm-workspace.yaml,target=pnpm-workspace.yaml \
    --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts


FROM node-base AS build-env

COPY --from=dependencies-env /app/node_modules /app/node_modules

COPY . /app/

WORKDIR /app

RUN pnpm run build


FROM nginx:1.27-alpine

COPY --from=build-env /app/build/client /usr/share/nginx/html

EXPOSE 80/tcp