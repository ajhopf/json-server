const lista = document.getElementById('lista');
const form = document.querySelector('#form');

const BASE_URL = 'https://json-server-dddjfttyq-ajhopf.vercel.app';

const populatePost = async post => {
  try {
    const li = document.createElement('li');

    li.id = post.id;

    //titulo
    const title = document.createElement('h3');
    title.innerText = post.title;
    li.appendChild(title);

    //texto
    const text = document.createElement('p');
    text.innerText = post.description;
    li.appendChild(text);

    //buttonDeletar
    const button = document.createElement('button');
    button.innerText = 'Excluir';
    button.addEventListener('click', event => {
      console.log(post.id);
      deletePost(post.id);
    });
    li.appendChild(button);

    //buttonEditar
    const buttonEdit = document.createElement('button');
    buttonEdit.innerText = 'Editar';
    buttonEdit.addEventListener('click', () => {
      editPost(post.id);
    });
    li.appendChild(buttonEdit);

    lista.appendChild(li);
  } catch (error) {
    console.log(error);
  }
};

const populatePosts = posts => {
  lista.innerHTML = '';

  posts.forEach(post => {
    populatePost(post);
  });
};

const getPosts = async () => {
  const response = await fetch(`${BASE_URL}/posts/`);
  const data = await response.json();
  populatePosts(data);
};

const createPost = async body => {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(body)
  });

  return await response.json();
};

const updatePost = async body => {
  const response = await fetch(`${BASE_URL}/posts/${body.id}`, {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(body)
  });

  return response.json();
};

const deletePost = async id => {
  await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE'
  });

  const li = document.getElementById(id);
  li.remove();
};

const getPost = async id => {
  const response = await fetch(`${BASE_URL}/posts/${id}`);
  const data = await response.json();
  return data;
};

const editPost = async id => {
  const post = await getPost(id);
  console.log(post);

  const code = document.getElementById('code');
  code.value = post.id;

  const title = document.getElementById('title');
  title.value = post.title;
  const description = document.getElementById('description');
  description.value = post.description;
};

const submitForm = async event => {
  event.preventDefault();

  const title = event.target.title;
  const description = event.target.description;

  const code = event.target.code;

  const post = { title: title.value, description: description.value };

  if (code.value) {
    const updatedPost = await updatePost({ ...post, id: code.value });

    const item = document.getElementById(code.value);
    item.children[0].innerText = updatedPost.title;
    item.children[1].innerText = updatedPost.description;
  } else {
    const createdPost = await createPost(post);
    populatePost(createdPost);
  }

  form.reset();
};

form.addEventListener('submit', event => {
  submitForm(event);
});

window.addEventListener('load', getPosts);
