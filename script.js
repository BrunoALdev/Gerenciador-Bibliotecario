let linhaEditando = null;

function adicionarRegistro(event) {
  event.preventDefault();

  let livro = document.getElementById('livro').value;
  let isbn = document.getElementById('isbn').value;
  let status = document.getElementById('status').value;
  let nomeLeitor = document.getElementById('nome-leitor').value;
  let cpfLeitor = document.getElementById('cpf-leitor').value;
  let dataEmprestimo = inverterData(document.getElementById('data-emprestimo').value);
  let dataDevolucao = inverterData(document.getElementById('data-devolucao').value);

  let emprestimo = {
    livro: livro,
    isbn: isbn,
    status: status,
    nomeLeitor: nomeLeitor,
    cpfLeitor: cpfLeitor,
    dataEmprestimo: dataEmprestimo,
    dataDevolucao: dataDevolucao
  };

  if (linhaEditando !== null) {
    atualizarRegistroTabela(linhaEditando, emprestimo);
    linhaEditando = null;
  } else {
    adicionarRegistroTabela(emprestimo);
  }

  document.getElementById('form-biblioteca').reset();
  salvarLocalStorage();
}

function inverterData(data) {
  if (data) {
    let partes = data.split("-");
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return '';
}

function inverterDataParaFormulario(data) {
  if (data) {
    let partes = data.split("-");
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return '';
}

function adicionarRegistroTabela(emprestimo) {
  let tabela = document.getElementById('tabela-biblioteca').getElementsByTagName('tbody')[0];
  let novaLinha = tabela.insertRow();

  let colunas = [
    emprestimo.livro,
    emprestimo.isbn,
    emprestimo.status,
    emprestimo.nomeLeitor,
    emprestimo.cpfLeitor,
    emprestimo.dataEmprestimo,
    emprestimo.dataDevolucao,
    getStatusButtonHTML(emprestimo.status),
    '<button onclick="editarRegistro(this)">Editar</button> <button onclick="removerRegistro(this)">Remover</button>'
  ];

  colunas.forEach(function (valor) {
    let novaColuna = novaLinha.insertCell();
    novaColuna.innerHTML = valor;
  });

  let devolverButton = novaLinha.querySelector('.devolver-button');
  if (emprestimo.status !== 'emprestado') {
    devolverButton.disabled = true;
  }
}

function atualizarRegistroTabela(indice, emprestimo) {
  let tabela = document.getElementById('tabela-biblioteca');
  let linha = tabela.rows[indice + 1]; 

  linha.cells[0].textContent = emprestimo.livro;
  linha.cells[1].textContent = emprestimo.isbn;
  linha.cells[2].textContent = emprestimo.status;
  linha.cells[3].textContent = emprestimo.nomeLeitor;
  linha.cells[4].textContent = emprestimo.cpfLeitor;
  linha.cells[5].textContent = emprestimo.dataEmprestimo;
  linha.cells[6].textContent = emprestimo.dataDevolucao;

  let devolverButton = linha.querySelector('.devolver-button');
  if (emprestimo.status !== 'emprestado') {
    if (devolverButton) devolverButton.disabled = true;
  } else {
    if (devolverButton) devolverButton.disabled = false;
  }

  linha.cells[7].innerHTML = getStatusButtonHTML(emprestimo.status);
  linha.cells[8].innerHTML = '<button onclick="editarRegistro(this)">Editar</button> <button onclick="removerRegistro(this)">Remover</button>';
}

function getStatusButtonHTML(status) {
  if (status === 'emprestado') {
    return '<button class="devolver-button" onclick="devolverLivro(this)">Devolver</button>';
  } else {
    return '';
  }
}

function salvarLocalStorage() {
  let registros = [];
  let tabela = document.getElementById('tabela-biblioteca').getElementsByTagName('tbody')[0];

  for (let i = 0; i < tabela.rows.length; i++) {
    let linha = tabela.rows[i];
    let emprestimo = {
      livro: linha.cells[0].textContent,
      isbn: linha.cells[1].textContent,
      status: linha.cells[2].textContent,
      nomeLeitor: linha.cells[3].textContent,
      cpfLeitor: linha.cells[4].textContent,
      dataEmprestimo: linha.cells[5].textContent,
      dataDevolucao: linha.cells[6].textContent
    };
    registros.push(emprestimo);
  }

  localStorage.setItem('registros', JSON.stringify(registros));
}

window.onload = function () {
  let registros = JSON.parse(localStorage.getItem('registros')) || [];
  registros.forEach(function (emprestimo) {
    adicionarRegistroTabela(emprestimo);
  });
}

function devolverLivro(botao) {
  let linha = botao.closest('tr');
  let colunas = linha.cells;

  colunas[3].textContent = '';
  colunas[4].textContent = '';
  colunas[5].textContent = '';
  colunas[6].textContent = '';

  colunas[2].textContent = 'disponivel';

  botao.disabled = true;

  salvarLocalStorage();
}

function editarRegistro(botao) {
  let linha = botao.closest('tr');
  let colunas = linha.cells;

  document.getElementById('livro').value = colunas[0].textContent;
  document.getElementById('isbn').value = colunas[1].textContent;
  document.getElementById('status').value = colunas[2].textContent;
  document.getElementById('nome-leitor').value = colunas[3].textContent;
  document.getElementById('cpf-leitor').value = colunas[4].textContent;
  document.getElementById('data-emprestimo').value = inverterDataParaFormulario(colunas[5].textContent);
  document.getElementById('data-devolucao').value = inverterDataParaFormulario(colunas[6].textContent);

  linhaEditando = linha.rowIndex - 1;
}

function inverterDataParaFormulario(data) {
  if (data) {
    let partes = data.split("-");
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return '';
}

function removerRegistro(botao) {
  let indexLinha = botao.closest('tr').rowIndex - 1;
  let registros = JSON.parse(localStorage.getItem('registros')) || [];
  registros.splice(indexLinha, 1);
  localStorage.setItem('registros', JSON.stringify(registros));
  botao.closest('tr').remove();
}

document.getElementById('input-busca').addEventListener('input', function () {
  let termo = this.value.trim().toLowerCase();
  let linhas = document.getElementById('tabela-biblioteca').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

  Array.from(linhas).forEach(function (linha) {
    let encontrou = false;
    Array.from(linha.cells).forEach(function (celula) {
      if (celula.textContent.toLowerCase().includes(termo)) {
        encontrou = true;
      }
    });
    if (encontrou) {
      linha.classList.add('highlight');
    } else {
      linha.classList.remove('highlight');
    }
  });

  if (termo === '') {
    Array.from(linhas).forEach(function (linha) {
      linha.classList.remove('highlight');
    });
  }
});

