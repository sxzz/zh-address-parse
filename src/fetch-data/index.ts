import { promises as fs } from 'fs';
import path from 'path';

import got from 'got';
import cheerio from 'cheerio';

fetchMcaGovData(
  'http://www.mca.gov.cn/article/sj/xzqh/2020/2020/2020112010001.html',
  'xl7014987',
  'xl7114987'
).catch(err => {
  console.error('parse with error!', err);
});

interface ProvinceOrCity<T> {
  code: string;
  name: string;
  children: T[];
}
interface Area {
  code: string;
  name: string;
}

type City = ProvinceOrCity<Area>;
type Province = ProvinceOrCity<City>;

async function fetchMcaGovData(
  sourceUrl: string,
  headerClass: string,
  areaClass: string
) {
  const response = await got(sourceUrl, {
    responseType: 'text',
    resolveBodyOnly: true,
  });
  const $ = cheerio.load(response);

  const $areaList = $('.' + areaClass).filter(
    (_index, item) => !!$(item).text().trim()
  );
  const $provinceCityList = $('.' + headerClass).filter(
    (_index, item) => !!$(item).text().trim()
  );
  console.log('省市总计数量：' + $provinceCityList.length / 2);
  console.log('区总计数量：' + $areaList.length / 2);

  const total = ($areaList.length + $provinceCityList.length) / 2;
  console.log('省市区总计数量：' + total);

  const provinces: Province[] = [];
  for (let i = 0; i <= $provinceCityList.length; i += 2) {
    const code = $($provinceCityList[i]).text().trim();
    const next = $($provinceCityList[i + 1])
      .text()
      .trim();

    if (/\d/.test(code)) {
      // 省份
      if (code.endsWith('0000')) {
        const province: Province = {
          code,
          name: next,
          children: [],
        };
        provinces.push(province);
      } else {
        // 市
        const city: City = {
          code,
          name: next,
          children: [],
        };
        // 省份前缀
        const prefixProvinceCode = code.substring(0, 2);
        const provinceRegexp = new RegExp(`^${prefixProvinceCode}`);

        // 市前缀匹配，加入到省份里面
        const province = provinces.find(item => provinceRegexp.test(item.code));
        province && province.children.push(city);
      }
    }
  }

  // 处理区和县
  for (const province of provinces) {
    // 省份前缀
    const prefixProvinceCode = province.code.substring(0, 2);
    const cityList = province.children;

    // 对于区，一个个处理，处理一个删除一个
    do {
      let code = $($areaList[0]).text().trim();
      let next = $($areaList[1]).text().trim();

      // 匹配省份
      let regExp = new RegExp(`^${prefixProvinceCode}`);
      if (/\d/.test(code)) {
        if (regExp.test(code)) {
          const area: Area = {
            code,
            name: next,
          };

          // 取区中间两位市的代号
          const prefixCityCode = code.substring(2, 4);
          regExp = new RegExp(`^${prefixProvinceCode}${prefixCityCode}`);

          // 找出市，找到就加入到市里的下面的区
          const currentCity = cityList.find(
            cityItem =>
              regExp.test(cityItem.code) && cityItem.code.endsWith('00')
          );
          if (cityList.length && currentCity) {
            currentCity.children.push(area);
          } else {
            // 解析直辖市下面的区和县
            if (cityList.length === 0) {
              const city: City = {
                name: province.name,
                code: province.code,
                children: [area],
              };
              cityList.push(city);
            } else {
              cityList[0].children.push(area);
            }
          }

          // @ts-ignore
          $areaList.splice(0, 2);
        } else {
          break;
        }
      }
    } while ($areaList.length > 0);
  }

  let i = 0;
  for (const province of provinces) {
    i++;
    for (const city of province.children) {
      i++;
      i += city.children.length;
    }
  }

  // 多了 4 个直辖市
  const parseTotal = i - 4;
  console.log('解析完成总计数量：' + parseTotal, total);
  console.log(
    '解析数量是否相等：' + (parseTotal === total ? '相等' : '不相等')
  );

  if (parseTotal === total) {
    await fs.writeFile(
      path.resolve(__dirname, '..', '..', 'data', 'all.json'),
      JSON.stringify(provinces)
    );
    console.log('导出成功');
  } else {
    throw new Error('解析前后数量不相等，解析失败！');
  }
}
