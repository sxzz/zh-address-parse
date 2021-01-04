# China's delivery address parse

Fork from [ldwonday/zh-address-parse](https://github.com/ldwonday/zh-address-parse)

数据更新至 [国家统计局数据](http://www.mca.gov.cn/article/sj/xzqh/2020/2020/2020112010001.html) 2020-11-20

## Preview

[Demo](https://sxzz.github.io/zh-address-parse/)

## Syntax

> AddressParse(address[, [option|0|1]])

option 可选参数属性列表

| 参数名        | 说明           | 类型   | 是否必填 | 默认值 |
| ------------- | -------------- | ------ | -------- | ------ |
| type          | 解析方式       | Number | 否       | 0      |
| textFilter    | 预过滤字段     | Array  | 否       | []     |
| nameMaxLength | 中文名最大长度 | Number | 否       | 4      |

## Usage

> import

```js
import AddressParse from './dist/zh-address-parse.min.js';
// options为可选参数，不传默认使用正则查找
const options = {
  type: 0, // 哪种方式解析，0：正则，1：树查找
  textFilter: [], // 预清洗的字段
  nameMaxLength: 4, // 查找最大的中文名字长度
};
// type参数0表示使用正则解析，1表示采用树查找, textFilter地址预清洗过滤字段。
const parseResult = AddressParse('your address', options);
// The parseResult is an object contain { province: '', name: '', city: '', area: '', detail: '', phone: '', postalCode: '' }
```

## Setup

Install dependencies

```sh
$ pnpm i --shamefully-hoist
```

## Development

```sh
$ pnpm docs:dev
```

## Deployment

Build the current application

```sh
$ pnpm lib:build
```
