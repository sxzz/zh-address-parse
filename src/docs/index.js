import $ from 'jquery';

import AddressParse from '../lib/address-parse';
import './index.scss';

(() => {
  let type = 0;
  const onTextAreaBlur = e => {
    const address = e.target.value;
    const parseResult = AddressParse(address, {
      type,
      textFilter: ['电話', '電話', '聯系人'],
    });
    console.log(parseResult);
    $('#result').empty();
    $('#result').append(
      `<ul>${Object.entries(parseResult)
        .map(([k, v]) => `<li>${k}：${v}</li>`)
        .join('')}</ul>`
    );
  };
  $('#addressContent').on('input propertychange', onTextAreaBlur);

  $('#addressList li').on('click', e => {
    $('#addressContent').val(e.target.innerText);
    $('#addressContent')[0].dispatchEvent(new Event('input'));
  });

  $('#select').val(type);
  $('#select').on('change', e => {
    type = Number(e.target.value);
  });
})();
