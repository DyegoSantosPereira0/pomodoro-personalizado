document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const timerDisplay = {
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const pomodoroLength = document.getElementById('pomodoro-length');
    const subjectName = document.getElementById('subject-name');
    const sections = document.querySelectorAll('main > section');
    const navButtons = document.querySelectorAll('nav button');
    const subjectForm = document.getElementById('subject-form');
    const subjectInput = document.getElementById('subject-input');
    const percentageInput = document.getElementById('percentage-input');
    const subjectsList = document.getElementById('subjects-list');
    const reviewsList = document.getElementById('reviews-list');
    const historyTable = document.querySelector('#history-table tbody');
    const observationModal = document.getElementById('observation-modal');
    const observationText = document.getElementById('observation-text');
    const saveObservationBtn = document.getElementById('save-observation');

    // Variáveis do timer
    let timer;
    let timeLeft = 0;
    let isRunning = false;
    let currentSubject = null;
    let startTime = null;

    // Navegação entre seções
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.id.replace('-btn', '-section');
            
            // Esconde todas as seções
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostra a seção correspondente
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Timer functions
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerDisplay.minutes.textContent = minutes.toString().padStart(2, '0');
        timerDisplay.seconds.textContent = seconds.toString().padStart(2, '0');
    }

    function startTimer() {
        if (isRunning) return;
        
        if (timeLeft <= 0) {
            timeLeft = parseInt(pomodoroLength.value) * 60;
        }
        
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        startTime = new Date();
        
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                showObservationModal();
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        timeLeft = parseInt(pomodoroLength.value) * 60;
        updateDisplay();
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function showObservationModal() {
        observationModal.style.display = 'block';
    }

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    pomodoroLength.addEventListener('change', resetTimer);

    // Gerenciamento de matérias (simulado - em uma aplicação real, isso seria conectado ao backend)
    let subjects = [];
    
    subjectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const subjectName = subjectInput.value.trim();
        const percentage = parseInt(percentageInput.value);
        
        if (subjectName && percentage > 0 && percentage <= 100) {
            const newSubject = {
                id: Date.now(),
                name: subjectName,
                percentage: percentage
            };
            
            subjects.push(newSubject);
            renderSubjectsList();
            
            subjectInput.value = '';
            percentageInput.value = '';
        }
    });

    function renderSubjectsList() {
        subjectsList.innerHTML = '';
        
        subjects.forEach(subject => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${subject.name} (${subject.percentage}%)</span>
                <div>
                    <button class="study-subject" data-id="${subject.id}">Estudar</button>
                    <button class="delete-subject" data-id="${subject.id}">X</button>
                </div>
            `;
            
            subjectsList.appendChild(li);
        });
        
        // Adiciona event listeners aos novos botões
        document.querySelectorAll('.study-subject').forEach(btn => {
            btn.addEventListener('click', function() {
                const subjectId = parseInt(this.getAttribute('data-id'));
                const subject = subjects.find(s => s.id === subjectId);
                
                if (subject) {
                    currentSubject = subject;
                    subjectName.textContent = subject.name;
                    
                    // Volta para a seção do timer
                    document.getElementById('timer-section').classList.add('active');
                    document.getElementById('subjects-section').classList.remove('active');
                }
            });
        });
        
        document.querySelectorAll('.delete-subject').forEach(btn => {
            btn.addEventListener('click', function() {
                const subjectId = parseInt(this.getAttribute('data-id'));
                subjects = subjects.filter(s => s.id !== subjectId);
                renderSubjectsList();
                
                if (currentSubject && currentSubject.id === subjectId) {
                    currentSubject = null;
                    subjectName.textContent = 'Nenhuma selecionada';
                }
            });
        });
    }

    // Simulação de revisões (em uma aplicação real, isso viria do backend)
    let reviews = [
        { id: 1, subject: 'Matemática', dueDate: '2023-11-15', type: 'Primeira Revisão' },
        { id: 2, subject: 'História', dueDate: '2023-11-16', type: 'Segunda Revisão' },
        { id: 3, subject: 'Ciências', dueDate: '2023-11-30', type: 'Terceira Revisão' }
    ];

    function renderReviewsList() {
        reviewsList.innerHTML = '';
        
        reviews.forEach(review => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${review.subject} - ${review.type} (${review.dueDate})</span>
                <button class="start-review" data-id="${review.id}">Iniciar</button>
            `;
            
            reviewsList.appendChild(li);
        });
        
        document.querySelectorAll('.start-review').forEach(btn => {
            btn.addEventListener('click', function() {
                const reviewId = parseInt(this.getAttribute('data-id'));
                const review = reviews.find(r => r.id === reviewId);
                
                if (review) {
                    currentSubject = { name: review.subject };
                    subjectName.textContent = `${review.subject} (${review.type})`;
                    
                    // Volta para a seção do timer
                    document.getElementById('timer-section').classList.add('active');
                    document.getElementById('reviews-section').classList.remove('active');
                }
            });
        });
    }

    // Simulação de histórico (em uma aplicação real, isso viria do backend)
    let studyHistory = [
        { date: '2023-11-10', subject: 'Matemática', duration: '30 min', notes: 'Álgebra linear' },
        { date: '2023-11-09', subject: 'História', duration: '45 min', notes: 'Revolução Francesa' },
        { date: '2023-11-08', subject: 'Ciências', duration: '60 min', notes: 'Células e organelas' }
    ];

    function renderHistoryTable() {
        historyTable.innerHTML = '';
        
        studyHistory.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.subject}</td>
                <td>${record.duration}</td>
                <td>${record.notes}</td>
            `;
            
            historyTable.appendChild(row);
        });
    }

    // Observações
    saveObservationBtn.addEventListener('click', function() {
        const notes = observationText.value.trim();
        
        if (currentSubject && notes) {
            // Em uma aplicação real, isso seria salvo no backend
            studyHistory.unshift({
                date: new Date().toISOString().split('T')[0],
                subject: currentSubject.name,
                duration: `${pomodoroLength.value} min`,
                notes: notes
            });
            
            // Agendar revisões (simulado)
            if (!currentSubject.name.includes('Revisão')) {
                const today = new Date();
                
                // Primeira revisão (hoje à noite)
                reviews.push({
                    id: Date.now(),
                    subject: currentSubject.name,
                    dueDate: today.toISOString().split('T')[0],
                    type: 'Primeira Revisão'
                });
                
                // Segunda revisão (amanhã)
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                reviews.push({
                    id: Date.now() + 1,
                    subject: currentSubject.name,
                    dueDate: tomorrow.toISOString().split('T')[0],
                    type: 'Segunda Revisão'
                });
                
                // Terceira revisão (15 dias)
                const in15Days = new Date(today);
                in15Days.setDate(in15Days.getDate() + 15);
                reviews.push({
                    id: Date.now() + 2,
                    subject: currentSubject.name,
                    dueDate: in15Days.toISOString().split('T')[0],
                    type: 'Terceira Revisão'
                });
                
                // Quarta revisão (30 dias)
                const in30Days = new Date(today);
                in30Days.setDate(in30Days.getDate() + 30);
                reviews.push({
                    id: Date.now() + 3,
                    subject: currentSubject.name,
                    dueDate: in30Days.toISOString().split('T')[0],
                    type: 'Quarta Revisão'
                });
            }
            
            renderHistoryTable();
            renderReviewsList();
            
            observationText.value = '';
            observationModal.style.display = 'none';
            resetTimer();
        }
    });

    // Inicialização
    resetTimer();
    renderSubjectsList();
    renderReviewsList();
    renderHistoryTable();
});