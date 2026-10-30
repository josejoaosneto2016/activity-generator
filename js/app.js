const $ = (id) => document.getElementById(id);
const recentActivities = [];
let currentActivityText = '';

const profileKey = 'activity-generator-profile';
function loadProfile() {
  try { return JSON.parse(localStorage.getItem(profileKey) || 'null'); }
  catch { return null; }
}
function showProfile(profile) {
  $('signup-screen').hidden = Boolean(profile?.name && profile?.email);
  if (profile?.name) $('welcome-user').textContent = `Olá, ${profile.name}`;
}
showProfile(loadProfile());
$('signup-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const profile = {
    name: $('signup-name').value.trim(),
    email: $('signup-email').value.trim()
  };
  if (!profile.name || !profile.email) return;
  try {
    localStorage.setItem(profileKey, JSON.stringify(profile));
    showProfile(profile);
  } catch {
    const error = document.createElement('p');
    error.setAttribute('role', 'alert');
    error.textContent = 'Não foi possível salvar seu perfil neste navegador. Verifique as configurações de armazenamento e tente novamente.';
    form.querySelector('[role="alert"]')?.remove();
    form.append(error);
  }
});

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => { toast.style.display = 'none'; }, 2800);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function buildActivityText(activity, includeAnswerKey) {
  const lines = [
    `ATIVIDADE DE ${activity.materia.toLocaleUpperCase('pt-BR')}`,
    `Assunto: ${activity.assunto}`,
    `Ano escolar: ${activity.ano} | Nível: ${activity.nivel}`,
    'Nome: ______________________________ Data: ____/____/______',
    ''
  ];
  activity.questoes.forEach((question, index) => {
    lines.push(`${index + 1}. ${question.enunciado}`);
    question.alternativas?.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}) ${option}`));
    if (!question.alternativas) lines.push('Resposta: ______________________________________________', '_________________________________________________________');
    lines.push('');
  });
  if (includeAnswerKey) {
    lines.push('GABARITO / ORIENTAÇÕES:');
    activity.questoes.forEach((question, index) => lines.push(`${index + 1}. ${question.resposta}`));
  }
  return lines.join('\n');
}

function renderActivity(activity, settings) {
  const questions = activity.questoes.map((question, index) => {
    const options = question.alternativas?.map((option, optionIndex) =>
      `<div class="option"><b>${String.fromCharCode(65 + optionIndex)})</b> ${escapeHtml(option)}</div>`
    ).join('') || '<div class="question-answer">Resposta: __________________________________________________</div><div class="question-answer">___________________________________________________________</div>';
    return `<div class="question"><strong>${index + 1}. ${escapeHtml(question.enunciado)}</strong>${options}</div>`;
  }).join('');
  const answerKey = settings.gabarito === 'sim'
    ? `<div class="answer-key"><b>GABARITO / ORIENTAÇÕES DE RESPOSTA</b><ol>${activity.questoes.map((question) => `<li>${escapeHtml(question.resposta)}</li>`).join('')}</ol><small>Revise o material antes de usar a atividade.</small></div>`
    : '';
  $('saida').innerHTML = `
    <div class="result-top"><div><h3>Atividade gerada!</h3><p>${escapeHtml(settings.materia)} · ${escapeHtml(settings.ano)} · Nível ${escapeHtml(settings.nivel.toLowerCase())}</p></div><div class="actions"><button class="copy" id="copiar" type="button">▣ Copiar atividade</button><button class="secondary" id="imprimir" type="button">Imprimir</button></div></div>
    <div id="conteudoAtividade"><div class="print-brand"><img src="/logo-activity-generator.png" alt="Activity Generator"><span>Crie. Aprenda. Compartilhe.</span></div><div class="worksheet-title"><h2>ATIVIDADE DE ${escapeHtml(settings.materia.toLocaleUpperCase('pt-BR'))}</h2><div><b>Assunto:</b> ${escapeHtml(settings.assunto)}</div><div class="student-line">Nome: __________________________________________ &nbsp; Data: ____/____/______</div><div class="student-line">Turma: __________________________</div></div>${questions}${answerKey}</div>`;
  document.querySelector('.result').hidden = false;
  $('saida').hidden = false;
  $('copiar').addEventListener('click', copyActivity);
  $('imprimir').addEventListener('click', () => window.print());
}

async function copyActivity() {
  try {
    await navigator.clipboard.writeText(currentActivityText);
    showToast('Atividade copiada! Agora cole no Word.');
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = currentActivityText;
    document.body.append(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    showToast('Atividade copiada! Agora cole no Word.');
  }
}

function renderHistory() {
  $('historico').innerHTML = recentActivities.length
    ? recentActivities.map((item) => `<span class="history-chip">${escapeHtml(item)}</span>`).join('')
    : '<span class="history-empty">Suas atividades recentes aparecerão aqui.</span>';
}

async function generateActivity(event) {
  event.preventDefault();
  const form = $('formulario');
  if (!form.reportValidity()) return;
  const button = $('gerar');
  const settings = {
    materia: $('materia').value,
    ano: $('ano').value,
    nivel: $('nivel').value,
    assunto: $('assunto').value.trim(),
    quantidade: Number($('quantidade').value),
    tipo: $('tipo').value,
    gabarito: $('gabarito').value
  };
  if (!settings.assunto) return;

  button.disabled = true;
  button.textContent = '⏳ Criando questões…';
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Não foi possível gerar a atividade.');
    renderActivity(payload.atividade, settings);
    currentActivityText = buildActivityText(payload.atividade, settings.gabarito === 'sim');
    recentActivities.unshift(`${settings.materia} · ${settings.assunto}`);
    recentActivities.splice(5);
    renderHistory();
    showToast('Atividade criada! Confira as questões antes de usar.');
  } catch (error) {
    showToast(error.message || 'Não foi possível conectar ao servidor. Tente novamente.');
  } finally {
    button.disabled = false;
    button.textContent = '✨ Gerar atividade';
  }
}

$('formulario').addEventListener('submit', generateActivity);
$('ir-para-criador').addEventListener('click', () => {
  $('materia').focus();
  $('criador').scrollIntoView({ behavior: 'smooth' });
});
$('limpar').addEventListener('click', () => {
  recentActivities.length = 0;
  renderHistory();
  showToast('Lista limpa.');
});
