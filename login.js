function showSignupForm() {
  var signupContainer = document.getElementById('signup-container');
  signupContainer.classList.toggle('show');
}

function hideSignupForm() {
  var signupContainer = document.getElementById('signup-container');
  signupContainer.classList.remove('show');
}

function registerUser(event) {
  event.preventDefault();

  var nomeCompleto = document.getElementById('nome_completo').value;
  var cpf = document.getElementById('cpf').value;
  var email = document.getElementById('email').value;
  var senha = document.getElementById('senha').value;

  var user = {
      nomeCompleto: nomeCompleto,
      cpf: cpf,
      email: email,
      senha: senha
  };

  localStorage.setItem('user', JSON.stringify(user));

  alert('Cadastro realizado com sucesso!');

  hideSignupForm();
  return false;
}

function loginUser(event) {
  event.preventDefault();

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  var user = JSON.parse(localStorage.getItem('user'));

  if (user && user.email === username && user.senha === password) {
      window.location.href = "pagina_biblioteca.html";
  } else {
      alert('Usuário ou senha incorretos.');
  }

  return false;
}
