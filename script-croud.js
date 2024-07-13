//!Encontrar botão tarefa//

const btnAdicionarTarefa = document.querySelector(".app__button--add-task");
const formAdicionarTarefa = document.querySelector(".app__form-add-task");
const textArea = document.querySelector(".app__form-textarea");
const ulTarefas = document.querySelector(".app__section-task-list");
const paragrafoDescricaoDaTarefa = document.querySelector(
  ".app__section-active-task-description"
);

const btnRemoverConcluidas = document.querySelector("#btn-remover-concluidas");
const btnRemoverTodas = document.querySelector('#btn-remover-todas')

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function atualizarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  const svg = document.createElement("svg");
  svg.innerHTML = `

`;
  const paragrafo = document.createElement("p");

  paragrafo.textContent = tarefa.descricao;
  paragrafo.classList.add("app__section-task-list-item-description");

  const botao = document.createElement("button");
  botao.classList.add("app_button-edit");
  botao.onclick = () => {
    const novaDescricao = prompt("Qual é o novo nome da tarefa?");
    //  console.log('Nova descrição da tarefa: ', novaDescricao)
    if (novaDescricao) {
      paragrafo.textContent = novaDescricao;
      tarefa.descricao = novaDescricao;
      atualizarTarefas();
    }
  };

  const btnCancelar = document.querySelector(
    ".app__form-footer__button--cancel "
  );
  const limparFormulario = () => {
    textArea.value = "";
    formAdicionarTarefa.classList.add("hidden");
  };
  btnCancelar.addEventListener("click", limparFormulario);

  const imagemBotao = document.createElement("img");

  imagemBotao.setAttribute("src", "/imagens/edit.png");
  botao.append(imagemBotao);
  li.append(svg);
  li.append(paragrafo);
  li.append(botao);

  if (tarefa.completa) {
    li.classList.add(".app__section-task-list-item-complete");
    botao.setAttribute("disable", "disable");
  } else {
    li.onclick = () => {
      document
        .querySelectorAll("app__section-task-list-item-active")
        .forEach((elemento) => {
          elemento.classList.remove("app__section-task-list-item-active");
        });
      if (tarefaSelecionada == tarefa) {
        paragrafoDescricaoDaTarefa.textContent = "";
        tarefaSelecionada = null;
        liTarefaSelecionada = null;
        return;
      }

      tarefaSelecionada = tarefa;
      liTarefaSelecionada = li;
      paragrafoDescricaoDaTarefa.textContent = tarefa.descricao;

      li.classList.add("app__section-task-list-item-active");
    };
  }

  li.onclick = () => {
    document
      .querySelectorAll("app__section-task-list-item-active")
      .forEach((elemento) => {
        elemento.classList.remove("app__section-task-list-item-active");
      });
    if (tarefaSelecionada == tarefa) {
      paragrafoDescricaoDaTarefa.textContent = "";
      tarefaSelecionada = null;
      liTarefaSelecionada = null;
      return;
    }

    tarefaSelecionada = tarefa;
    liTarefaSelecionada = li;
    paragrafoDescricaoDaTarefa.textContent = tarefa.descricao;

    li.classList.add("app__section-task-list-item-active");
  };

  return li;
}

btnAdicionarTarefa.addEventListener("click", () => {
  formAdicionarTarefa.classList.toggle("hidden");
});

formAdicionarTarefa.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const descricaoTarefa = textArea.value;
  const tarefa = {
    descricao: textArea.value,
  };
  tarefas.push(tarefa);
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa);
  atualizarTarefas();
  textArea.value = "";
  formAdicionarTarefa.classList.add("hidden");
});

tarefas.forEach((tarefa) => {
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa);
});

document.addEventListener("FocoFinalizado", () => {
  if (tarefaSelecionada && liTarefaSelecionada) {
    liTarefaSelecionada.classList.remove("app__section-task-list-item-active");
    liTarefaSelecionada.classList.add(".app__section-task-list-item-complete");
    liTarefaSelecionada
      .querySelector("button")
      .setAttribute("disable", "disable");
    tarefaSelecionada.completa = true;
    atualizarTarefas();
  }
});

const removerTarefas = (somenteCompletas) => {
  const seletor = somenteCompletas
    ? ".app__section-task-list-item-complete"
    : "app__section-task-list-item";

  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.remove();
  });
  tarefas = somenteCompletas
    ? tarefas.filter((tarefa) => !tarefa.completa)
    : [];
  atualizarTarefas();
};

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = ()=> removerTarefas(false);
