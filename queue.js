class FilaAssincrona {
  constructor() {
    this.fila = []
    this.processando = false
  }

  async adicionarTarefa(tarefa) {
    this.fila.push(tarefa)
    await this.processarFila()
  }

  async processarFila() {
    if (this.processando) return

    this.processando = true

    while (this.fila.length > 0) {
      const tarefa = this.fila.shift()
      try {
        await tarefa()
      } catch (erro) {
        console.error('Erro ao processar tarefa:', erro)
      }
    }

    this.processando = false
  }
}

// Exemplo de uso da fila assíncrona
const fila = new FilaAssincrona()

function tarefaAssincrona(tempo, mensagem) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(mensagem)
      resolve()
    }, tempo)
  })
}

// Adiciona tarefas à fila
fila.adicionarTarefa(() =>
  tarefaAssincrona(2000, 'Tarefa 1 concluída após 2000 ms')
)
fila.adicionarTarefa(() =>
  tarefaAssincrona(1000, 'Tarefa 2 concluída após 1000 ms')
)
fila.adicionarTarefa(() =>
  tarefaAssincrona(3000, 'Tarefa 3 concluída após 3000 ms')
)

// Execução de outras operações
console.log('Operação principal em execução...')
