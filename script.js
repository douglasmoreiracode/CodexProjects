const STATUS_INFO = {
  todo: { label: 'A Fazer', color: getComputedStyle(document.documentElement).getPropertyValue('--todo').trim() || '#f97316' },
  progress: { label: 'Progredindo', color: getComputedStyle(document.documentElement).getPropertyValue('--progress').trim() || '#0ea5e9' },
  done: { label: 'Concluída', color: getComputedStyle(document.documentElement).getPropertyValue('--done').trim() || '#22c55e' }
};

const DAY_LABELS = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira'
};

// Persistence keys
const TASKS_KEY = 'todo_dashboard_tasks_v1';
const AVATAR_KEY = 'todo_dashboard_avatar_v1';

const initialTasks = [
  { id: crypto.randomUUID(), title: 'Planejar sprint', status: 'todo', day: 'segunda', start: '09:00', end: '10:30' },
  { id: crypto.randomUUID(), title: 'Reunião com equipe', status: 'progress', day: 'segunda', start: '11:00', end: '12:00' },
  { id: crypto.randomUUID(), title: 'Desenvolver feature', status: 'progress', day: 'terca', start: '13:30', end: '16:00' },
  { id: crypto.randomUUID(), title: 'Revisão de código', status: 'todo', day: 'quarta', start: '09:30', end: '11:00' },
  { id: crypto.randomUUID(), title: 'Testes automatizados', status: 'done', day: 'quinta', start: '10:00', end: '12:00' },
  { id: crypto.randomUUID(), title: 'Retrospectiva', status: 'done', day: 'sexta', start: '15:00', end: '16:00' }
];

let tasks = [];

const weeklyHours = {
  segunda: 6,
  terca: 7,
  quarta: 5,
  quinta: 6,
  sexta: 4
};

const weeklyCalendarEl = document.getElementById('weekly-calendar');
const progressBarsEl = document.getElementById('progress-bars');
const donutEl = document.getElementById('status-donut');
const legendEl = document.getElementById('percent-legend');
const agendaEl = document.getElementById('agenda');
const totalTasksEl = document.getElementById('total-tasks');
const counters = document.querySelectorAll('.counter-value');
const toggleFormBtn = document.getElementById('toggle-form');
const openFormBtn = document.getElementById('open-task-form');
const formEl = document.getElementById('task-form');
const cancelFormBtn = document.getElementById('cancel-task');
const avatarInput = document.getElementById('avatar-input');
const avatarPreview = document.getElementById('avatar-preview');

// ---- Persistence helpers ----
function saveTasks() {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {}
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    // Basic sanity: ensure required fields
    return parsed
      .filter((t) => t && t.title && t.status && t.day && t.start && t.end)
      .map((t) => ({ id: t.id || crypto.randomUUID(), ...t }));
  } catch {
    return null;
  }
}

function saveAvatar(src) {
  try { localStorage.setItem(AVATAR_KEY, src); } catch {}
}

function loadAvatar() {
  try { return localStorage.getItem(AVATAR_KEY); } catch { return null; }
}

function renderWeeklyCalendar() {
  const today = new Date();
  const weekdays = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const normalizedWeekdays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];

  weeklyCalendarEl.innerHTML = normalizedWeekdays
    .map((dayKey) => {
      const normalizedToday = weekdays[today.getDay()].normalize('NFD').replace(/\p{Diacritic}/gu, '');
      const isToday = normalizedToday === dayKey;
      return `
        <div class="week-day ${isToday ? 'current' : ''}">
          <strong>${DAY_LABELS[dayKey] || dayKey}</strong>
          <span>${weeklyHours[dayKey]} h trabalhadas</span>
        </div>
      `;
    })
    .join('');
}

function formatLabel(dayKey) {
  return DAY_LABELS[dayKey] || dayKey;
}

function updateProgressModules() {
  const totals = { todo: 0, progress: 0, done: 0 };
  tasks.forEach((task) => {
    if (totals[task.status] !== undefined) {
      totals[task.status] += 1;
    }
  });

  const totalTasks = tasks.length || 1;
  totalTasksEl.textContent = tasks.length;

  progressBarsEl.innerHTML = Object.entries(totals)
    .map(([status, count]) => {
      const percentage = Math.round((count / totalTasks) * 100);
      return `
        <div class="progress-item">
          <span class="progress-label">${STATUS_INFO[status].label}</span>
          <div class="progress-bar">
            <div class="progress-fill" style="background:${STATUS_INFO[status].color}; width:${percentage}%"></div>
          </div>
          <span class="progress-value">${percentage}%</span>
        </div>
      `;
    })
    .join('');

  counters.forEach((counter) => {
    const status = counter.dataset.status;
    counter.textContent = totals[status];
  });

  const percentages = Object.entries(totals).map(([status, count]) => ({
    status,
    count,
    percentage: totalTasks === 0 ? 0 : Math.round((count / totalTasks) * 100)
  }));

  let startAngle = 0;
  const segments = percentages
    .map(({ status, percentage }) => {
      const endAngle = startAngle + (360 * percentage) / 100;
      const segment = `${STATUS_INFO[status].color} ${startAngle}deg ${endAngle}deg`;
      startAngle = endAngle;
      return segment;
    })
    .join(', ');

  donutEl.style.background = percentages.every((item) => item.percentage === 0)
    ? 'conic-gradient(#2a2f36 0deg 360deg)'
    : `conic-gradient(${segments})`;

  legendEl.innerHTML = percentages
    .map(({ status, percentage, count }) => `
      <li class="legend-item">
        <span class="legend-bullet" style="background:${STATUS_INFO[status].color}"></span>
        <div class="legend-text">
          <strong>${STATUS_INFO[status].label}</strong>
          <span>${percentage}% • ${count} tarefas</span>
        </div>
      </li>
    `)
    .join('');
}

function groupTasksByDay() {
  return tasks.reduce((acc, task) => {
    if (!acc[task.day]) acc[task.day] = [];
    acc[task.day].push(task);
    acc[task.day].sort((a, b) => a.start.localeCompare(b.start));
    return acc;
  }, {});
}

function renderAgenda() {
  const grouped = groupTasksByDay();
  const dayOrder = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];

  agendaEl.innerHTML = dayOrder
    .map((dayKey) => {
      const items = grouped[dayKey] || [];
      if (!items.length) {
        return `
          <div class="agenda-day">
            <header>
              <h3>${formatLabel(dayKey)}</h3>
              <span>Sem tarefas</span>
            </header>
          </div>
        `;
      }

      const taskItems = items
        .map(
          (task) => `
            <div class="task-item" data-id="${task.id}" data-status="${task.status}">
              <div>
                <p class="task-name">${task.title}</p>
                <p class="task-time">${task.start} - ${task.end}</p>
              </div>
              <span class="task-time">${STATUS_INFO[task.status].label}</span>
              <select class="task-status-select">
                <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>A Fazer</option>
                <option value="progress" ${task.status === 'progress' ? 'selected' : ''}>Progredindo</option>
                <option value="done" ${task.status === 'done' ? 'selected' : ''}>Concluída</option>
              </select>
            </div>
          `
        )
        .join('');

      return `
        <div class="agenda-day">
          <header>
            <h3>${formatLabel(dayKey)}</h3>
            <span>${items.length} ${items.length === 1 ? 'tarefa' : 'tarefas'}</span>
          </header>
          ${taskItems}
        </div>
      `;
    })
    .join('');
}

function updateDashboard() {
  updateProgressModules();
  renderAgenda();
}

function toggleForm(show) {
  formEl.hidden = !show;
  if (show) {
    formEl.querySelector('#task-title').focus();
  }
}

formEl?.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('task-title').value.trim();
  const status = document.getElementById('task-status').value;
  const day = document.getElementById('task-day').value;
  const start = document.getElementById('task-start').value;
  const end = document.getElementById('task-end').value;

  if (!title || !start || !end) return;

  tasks.push({ id: crypto.randomUUID(), title, status, day, start, end });
  saveTasks();
  formEl.reset();
  toggleForm(false);
  updateDashboard();
});

cancelFormBtn?.addEventListener('click', () => {
  formEl.reset();
  toggleForm(false);
});

openFormBtn?.addEventListener('click', () => toggleForm(true));
toggleFormBtn?.addEventListener('click', () => toggleForm(formEl.hidden));

agendaEl.addEventListener('change', (event) => {
  if (!event.target.classList.contains('task-status-select')) return;
  const taskItem = event.target.closest('.task-item');
  const taskId = taskItem?.dataset.id;
  if (!taskId) return;

  // Reflect the status on DOM for styling
  taskItem.dataset.status = event.target.value;

  tasks = tasks.map((task) => (task.id === taskId ? { ...task, status: event.target.value } : task));
  saveTasks();
  updateDashboard();
});

avatarInput?.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target?.result;
    avatarPreview.src = src;
    if (typeof src === 'string') saveAvatar(src);
  };
  reader.readAsDataURL(file);
});

// Pomodoro timer logic
const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;
let isWorkSession = true;
let remainingSeconds = WORK_DURATION;
let timerInterval = null;

const timerValueEl = document.getElementById('timer-value');
const timerLabelEl = document.querySelector('.timer-label');
const toggleTimerBtn = document.getElementById('toggle-timer');
const resetTimerBtn = document.getElementById('reset-timer');
const timerProgressEl = document.querySelector('.timer-progress');

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${secs}`;
}

function updateTimerDisplay() {
  timerValueEl.textContent = formatTime(remainingSeconds);
  timerLabelEl.textContent = isWorkSession ? 'Foco' : 'Descanso';
  const total = isWorkSession ? WORK_DURATION : BREAK_DURATION;
  const progress = 1 - remainingSeconds / total;
  const circumference = 2 * Math.PI * 54;
  timerProgressEl.style.strokeDashoffset = circumference * (1 - progress);
}

function switchSession() {
  isWorkSession = !isWorkSession;
  remainingSeconds = isWorkSession ? WORK_DURATION : BREAK_DURATION;
  updateTimerDisplay();
}

function tick() {
  if (remainingSeconds > 0) {
    remainingSeconds -= 1;
    updateTimerDisplay();
  } else {
    switchSession();
  }
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(tick, 1000);
  toggleTimerBtn.textContent = 'Pausar';
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  toggleTimerBtn.textContent = 'Iniciar';
}

function resetTimer() {
  pauseTimer();
  isWorkSession = true;
  remainingSeconds = WORK_DURATION;
  updateTimerDisplay();
}

toggleTimerBtn?.addEventListener('click', () => {
  if (timerInterval) {
    pauseTimer();
  } else {
    startTimer();
  }
});

resetTimerBtn?.addEventListener('click', resetTimer);

// Initial load: state from storage
const storedTasks = loadTasks();
tasks = storedTasks && storedTasks.length ? storedTasks : [...initialTasks];

const storedAvatar = loadAvatar();
if (storedAvatar) avatarPreview.src = storedAvatar;

renderWeeklyCalendar();
updateDashboard();
updateTimerDisplay();
