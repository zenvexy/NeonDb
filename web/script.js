const apiUrl = "https://neon-db.vercel.app";
const pagina = document.body.dataset.page;

let categorias = [];
let esfihas = [];
let editandoId = null;

const pegar = (id) => document.getElementById(id);

async function api(caminho, metodo = "GET", dados) {
  const opcoes = { method: metodo };

  if (dados) {
    opcoes.headers = { "Content-Type": "application/json" };
    opcoes.body = JSON.stringify(dados);
  }

  const resposta = await fetch(apiUrl + caminho, opcoes);
  const corpo = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(corpo.message || "Não foi possível concluir a operação.");
  }

  return corpo;
}

function texto(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function preco(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function mensagem(valor, erro = false) {
  const campo = pegar("mensagem");
  campo.textContent = valor;
  campo.className = erro ? "erro" : "sucesso";
}

async function carregarCategorias() {
  categorias = await api("/categorias/listar");

  if (pagina === "categorias") mostrarCategorias();
  if (pagina === "esfihas") preencherSelect();
}

function mostrarCategorias() {
  const busca = pegar("buscaCategorias").value.toLowerCase();

  const itens = categorias.filter((c) => c.nome.toLowerCase().includes(busca));

  pegar("listaCategorias").innerHTML = itens.map((c) => `
    <tr>
      <td>${texto(c.nome)}</td>
      <td>${c.esfihas.length}</td>
      <td>
        <button data-editar="${c.id}">Editar</button>
        <button class="perigo" data-excluir="${c.id}">Excluir</button>
      </td>
    </tr>
  `).join("");

  pegar("categoriasVazias").hidden = itens.length > 0;
  pegar("resumoCategorias").textContent = `${categorias.length} categorias cadastradas.`;
}

function preencherSelect() {
  const select = pegar("categoriaId");
  const selecionada = select.value;

  select.innerHTML = '<option value="">Escolha uma categoria</option>';

  categorias.forEach((c) => {
    select.innerHTML += `<option value="${c.id}">${texto(c.nome)}</option>`;
  });

  select.value = selecionada;
}

function limparCategoria() {
  editandoId = null;
  pegar("formCategoria").reset();
  pegar("tituloCategoria").textContent = "Nova categoria";
  pegar("cancelarCategoria").hidden = true;
}

function editarCategoria(id) {
  const categoria = categorias.find((c) => c.id == id);

  editandoId = id;
  pegar("nomeCategoria").value = categoria.nome;
  pegar("tituloCategoria").textContent = "Editar categoria";
  pegar("cancelarCategoria").hidden = false;
}

async function salvarCategoria(evento) {
  evento.preventDefault();

  const dados = { nome: pegar("nomeCategoria").value.trim() };

  try {
    if (editandoId) {
      await api(`/categorias/atualizar/${editandoId}`, "PUT", dados);
    } else {
      await api("/categorias/cadastrar", "POST", dados);
    }

    mensagem("Categoria salva.");
    limparCategoria();
    await carregarCategorias();
  } catch (erro) {
    mensagem(erro.message, true);
  }
}

async function excluirCategoria(id) {
  const categoria = categorias.find((c) => c.id == id);

  if (categoria.esfihas.length > 0) {
    mensagem("Exclua as esfihas desta categoria primeiro.", true);
    return;
  }

  if (!confirm("Excluir esta categoria?")) return;

  try {
    await api(`/categorias/excluir/${id}`, "DELETE");
    mensagem("Categoria excluída.");
    await carregarCategorias();
  } catch (erro) {
    mensagem(erro.message, true);
  }
}

function iniciarCategorias() {
  pegar("formCategoria").addEventListener("submit", salvarCategoria);
  pegar("cancelarCategoria").addEventListener("click", limparCategoria);
  pegar("buscaCategorias").addEventListener("input", mostrarCategorias);

  pegar("listaCategorias").addEventListener("click", (evento) => {
    const { editar, excluir } = evento.target.dataset;

    if (editar) editarCategoria(editar);
    if (excluir) excluirCategoria(excluir);
  });

  carregarCategorias().catch((erro) => mensagem(erro.message, true));
}

async function carregarEsfihas() {
  esfihas = await api("/esfihas/listar");
  mostrarEsfihas();
}

function mostrarEsfihas() {
  const busca = pegar("buscaEsfihas").value.toLowerCase();

  const itens = esfihas.filter((e) => {
    return `${e.nome} ${e.categoria.nome}`.toLowerCase().includes(busca);
  });

  pegar("listaEsfihas").innerHTML = itens.map((e) => `
    <tr>
      <td>${texto(e.nome)}</td>
      <td>${texto(e.categoria.nome)}</td>
      <td>${preco(e.preco)}</td>
      <td>${e.disponivel === "DISPONIVEL" ? "Disponível" : "Indisponível"}</td>
      <td>
        <button data-editar="${e.id}">Editar</button>
        <button class="perigo" data-excluir="${e.id}">Excluir</button>
      </td>
    </tr>
  `).join("");

  pegar("esfihasVazias").hidden = itens.length > 0;
  pegar("resumoEsfihas").textContent = `${esfihas.length} esfihas cadastradas.`;
}

function limparEsfiha() {
  editandoId = null;
  pegar("formEsfiha").reset();
  pegar("tituloEsfiha").textContent = "Nova esfiha";
  pegar("cancelarEsfiha").hidden = true;
}

function editarEsfiha(id) {
  const esfiha = esfihas.find((e) => e.id == id);

  editandoId = id;
  pegar("nomeEsfiha").value = esfiha.nome;
  pegar("precoEsfiha").value = esfiha.preco;
  pegar("disponivel").value = esfiha.disponivel;
  pegar("categoriaId").value = esfiha.categoriaId;
  pegar("tituloEsfiha").textContent = "Editar esfiha";
  pegar("cancelarEsfiha").hidden = false;
}

async function salvarEsfiha(evento) {
  evento.preventDefault();

  const dados = {
    nome: pegar("nomeEsfiha").value.trim(),
    preco: Number(pegar("precoEsfiha").value),
    disponivel: pegar("disponivel").value,
    categoriaId: Number(pegar("categoriaId").value)
  };

  try {
    if (editandoId) {
      await api(`/esfihas/atualizar/${editandoId}`, "PUT", dados);
    } else {
      await api("/esfihas/cadastrar", "POST", dados);
    }

    mensagem("Esfiha salva.");
    limparEsfiha();
    await carregarEsfihas();
  } catch (erro) {
    mensagem(erro.message, true);
  }
}

async function excluirEsfiha(id) {
  if (!confirm("Excluir esta esfiha?")) return;

  try {
    await api(`/esfihas/excluir/${id}`, "DELETE");
    mensagem("Esfiha excluída.");
    await carregarEsfihas();
  } catch (erro) {
    mensagem(erro.message, true);
  }
}

function iniciarEsfihas() {
  pegar("formEsfiha").addEventListener("submit", salvarEsfiha);
  pegar("cancelarEsfiha").addEventListener("click", limparEsfiha);
  pegar("buscaEsfihas").addEventListener("input", mostrarEsfihas);

  pegar("listaEsfihas").addEventListener("click", (evento) => {
    const { editar, excluir } = evento.target.dataset;

    if (editar) editarEsfiha(editar);
    if (excluir) excluirEsfiha(excluir);
  });

  carregarCategorias().catch((erro) => mensagem(erro.message, true));
  carregarEsfihas().catch((erro) => mensagem(erro.message, true));
}

if (pagina === "categorias") iniciarCategorias();
if (pagina === "esfihas") iniciarEsfihas();