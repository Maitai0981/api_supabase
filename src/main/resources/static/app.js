const API  = '';
const BASE = '/api/alunos';

const formulario = document.querySelector('form');
const Inome      = document.querySelector('.nome');
const Iserie     = document.querySelector('.serie');
const Isexo      = document.querySelector('.sexo');
const Iid        = document.getElementById('id');
const limparBtn  = document.getElementById('limparBtn');
const recarregarBtn = document.getElementById('recarregarBtn');
const tbody      = document.querySelector('#tabela tbody');
const msg        = document.getElementById('msg');

function setMsg(t, err=false){
    msg.textContent = t || '';
    msg.className   = err ? 'err' : '';
}

async function handleResponse(res) {
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorBody}`);
    }
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return res.json();
    }
    return null;
}

function listar(){
    fetch(API + BASE + '/listar', { headers: { 'Accept': 'application/json' } })
        .then(handleResponse)
        .then(renderTabela)
        .catch(err => setMsg('Erro ao listar: ' + err, true));
}

function salvar(dadosAluno, method = 'POST', url = API + BASE + '/cadastrar'){
    return fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAluno)
    }).then(handleResponse);
}

function obter(id){
    return fetch(`${API}${BASE}/${id}`, { headers: { 'Accept': 'application/json' } })
        .then(handleResponse);
}

function excluir(id){
    return fetch(`${API}${BASE}/${id}`, { method: 'DELETE' }).then(handleResponse);
}

function renderTabela(lista){
    tbody.innerHTML = '';
    if(!lista || !lista.length){
        tbody.innerHTML = '<tr><td colspan="4">Nenhum aluno.</td></tr>';
        return;
    }
    lista.forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${a.nome || ''}</td>
            <td>${a.serie || ''}</td>
            <td>${a.sexo || ''}</td>
            <td>
                <a class="action" data-act="edit" data-id="${a.id}">Editar</a>
                <a class="action" data-act="del"  data-id="${a.id}">Excluir</a>
            </td>`;
        tbody.appendChild(tr);
    });
}

function limpar(){
    formulario.reset();
    Iid.value = '';
    setMsg('');
}

formulario.addEventListener('submit', function(event){
    event.preventDefault();

    const dadosAluno = {
        nome:  Inome.value.trim(),
        serie: Iserie.value.trim(),
        sexo:  Isexo.value
    };

    if(!dadosAluno.nome){
        setMsg('O nome é obrigatório.', true);
        return;
    }

    let promise;
    if (Iid.value) {
        dadosAluno.id = Number(Iid.value);
        promise = salvar(dadosAluno, 'PUT', API + BASE);
    } else {
        promise = salvar(dadosAluno);
    }

    promise.then(() => {
        setMsg('Aluno salvo com sucesso!');
        limpar();
        listar();
    }).catch(err => {
        setMsg('Erro ao salvar: ' + err.message, true);
    });
});

tbody.addEventListener('click', function(ev){
    const a = ev.target.closest('a.action');
    if(!a) return;

    const id  = a.getAttribute('data-id');
    const act = a.getAttribute('data-act');

    if(act === 'edit'){
        obter(id).then(aluno => {
            Iid.value    = aluno.id   || '';
            Inome.value  = aluno.nome || '';
            Iserie.value = aluno.serie|| '';
            Isexo.value  = aluno.sexo || '';

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }).catch(err => setMsg('Erro ao carregar aluno: ' + err.message, true));
    }

    if(act === 'del'){
        if(confirm('Tem certeza que deseja excluir este aluno?')){
            excluir(id)
                .then(() => {
                    setMsg('Aluno excluído com sucesso.');
                    listar();
                })
                .catch(err => setMsg('Erro ao excluir: ' + err.message, true));
        }
    }
});

limparBtn.addEventListener('click', limpar);
recarregarBtn.addEventListener('click', listar);

listar();