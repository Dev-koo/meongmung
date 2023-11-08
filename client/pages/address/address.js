import '../../index.css';
import { init } from '../main.js';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const btn = document.querySelector('form');

const token = localStorage.getItem('token');

if (!token) {
  location.href = '/';
}
const label = document.getElementById('label');
const name = document.getElementById('name');
const phone = document.getElementById('phone');
const zipCode = document.getElementById('zipCode');
const mainAddress = document.getElementById('mainAddress');
const detailAddress = document.getElementById('detailAddress');

const addressBtn = document.getElementById('getAddress');

const dogListEl = document.querySelector('#dog-list');
const dogAddBtn = document.querySelector('.dog-add-btn');
const modal = document.querySelector('#modal');



//daum 주소 입력받기
addressBtn.addEventListener('click', function() {
    new daum.Postcode({
        oncomplete: function(data) {
            zipCode.value = data.zonecode;    
            mainAddress.value = data.address;
  
        }
    }).open();
  })
  


modal.addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    modal.classList.toggle('hidden');
  }
});

dogAddBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

btn.addEventListener('submit', function (e) {
  e.preventDefault();

  postAddresss();
});

const postAddresss = () => {
    console.log(name.value);
  fetch(`${API_BASE_URL}/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
        recipient: name.value,
        name : label.value,
        zipCode:zipCode.value,
        detailAddress:`${mainAddress.value}+${detailAddress.value}`,
        phone: phone.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === 200) {
        location.href = '/address/';
      }
    })
    .catch((error) => console.log(error));
};

const getAddress = async () => {
  return fetch(`${API_BASE_URL}/addresses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));
};

const renderList = async () => {
  let template = ``;

  const res = await getAddress();
  console.log(res);
  if (!res.addresses.length) {
    template += `<div class='w-full border-b border-b-zinc-400 py-10 flex justify-between items-center px-10 text-center'>
    <div class='flex-1'>사용자의 배송지 정보가 없습니다.</div>
    </div>`;
    dogListEl.insertAdjacentHTML('beforeend', template);
    return;
  }

  for (const address of res.addresses) {
    let arr=address.detailAddress.split("+");
    template += `<div class='w-full border-b border-b-zinc-200 gap-x-2 py-10 flex justify-between items-center px-5 text-center'>
    <div class='w-[100px]'>${address.name}</div>
    <div class='w-[100px] '>${address.zipCode}</div>
    <div class='flex-1 '>${arr[0]}</div>
    <div class='w-[100px]'>${arr[1]}</div>
    <div class='w-[100px]'><button id="${address._id}" class="update-btn hover:underline">수정하기</button></div>
    <div class='w-[80px]'><img id="${address._id}" class='dog-id mx-auto hover:cursor-pointer' src="/images/trash.svg"/></div>
  </div>`;
  }

  dogListEl.insertAdjacentHTML('beforeend', template);
  bindEvents(dogListEl);
};

const bindEvents = (document) => {
  const rows = document.querySelectorAll('.dog-id');
  const updateBtns = document.querySelectorAll('.update-btn');

  for (const btn of updateBtns) {
    btn.addEventListener('click', (e) => {
      console.log(e.target.id);
      location.href = `/address/edit/?id=${e.target.id}`;
    });
  }

  for (const row of rows) {
    row.addEventListener('click', (e) => {
      fetch(`${API_BASE_URL}/addresses/${e.target.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) location.href = '/address/';
        })
        .catch((error) => console.log(error));
    });
  }
};

renderList();
