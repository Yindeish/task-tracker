class DOMHelper {

    getElements () {
        const userInput = document.querySelector('.user-input input'),
        addTaskBtn = document.querySelector('.add-task'),
        tasksContainer = document.querySelector('.tasks-container'),
        deleteBtns = [...document.querySelectorAll('.delete')],
        editBtns = [...document.querySelectorAll('.edit')];

        return {
            userInput,
            addTaskBtn,
            tasksContainer,
            deleteBtns,
            editBtns
        }
    }

    createTemplate (element, childElem, htmlCode) {
        if( childElem ) {
            const offspringElement = document.createElement(childElem.tag);
            offspringElement.className = childElem.cls
            element.appendChild(offspringElement);
        } 
        if( htmlCode ) {
            element.innerHTML = htmlCode;
        }
    }

    toggleClass(element, classToToggle = 'hidden') {
        element.classList.toggle(classToToggle);
    }

    swapElements(oldElement, newElement) {
        this.toggleClass(oldElement);
        this.toggleClass(newElement);
    }
}

class TaskTracker {

    
    renderUI (taskToken) {

        const gottenTask = this.retreiveTask(taskToken);
        
        const { getElements, createTemplate } = new DOMHelper();
        const { userInput, tasksContainer } = getElements();

        const inputValue = userInput.value;

        if( inputValue !== '' ) {
            createTemplate(tasksContainer, {tag: 'li', cls: 'task'});
        }

        const taskElement = document.querySelector('.task:last-child');
        createTemplate(taskElement, null, 
            /*html*/ 
            `
            <div class="task-desc">
                <div class="output" data-task-token="${taskToken}">${gottenTask}</div>
                <input class="hidden" type="text">
            </div>
            <div class="task-controls f-centralize-block-xy">
                <button class="edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                </button>
                <button class="delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                </button>
            </div>
        `);

        this.clearField(userInput);
    }

    addTask() {

        const { getElements } = new DOMHelper();
        const { userInput } = getElements();

        const inputValue = userInput.value;

        const taskToken = this.generateToken(inputValue);

        localStorage.setItem(taskToken, inputValue);

        this.renderUI(taskToken);
    }

    retreiveTask(taskToken) {
        const gottenTask = localStorage.getItem(taskToken);

        return gottenTask;
    }

    deleteTask(taskToken) {
            
        localStorage.removeItem(taskToken);

        const { getElements } = new DOMHelper();
        const  { tasksContainer } = getElements();
        // Updating the UI
        const currentTaskElement = document.querySelector(`[data-task-token="${taskToken}"]`).closest('.task');
        tasksContainer.removeChild(currentTaskElement);
    }

    editTask(oldElement, newElement, taskToken) {

        const domHelper = new DOMHelper();

        domHelper.swapElements(oldElement, newElement);

        newElement.addEventListener('input', event => {
            oldElement.textContent = event.target.value;
        })

        // Replacing the previous token with the new token
        const newTaskToken = this.generateToken(oldElement.textContent);
        localStorage.removeItem(taskToken);
        localStorage.setItem(newTaskToken, oldElement.textContent);

        // Updating the UI
        oldElement.dataset.taskToken = newTaskToken;
        this.clearField(newElement);
    }

    generateToken(content) {
        let randomNumber = Math.floor(Math.random()* 10000) + 1;
        let token  = randomNumber + content;

        return token;
    }

    clearField(field) {

        field.value = '';

    }


}

class App {
    static init() {
        const taskTracker = new TaskTracker();
        
        const { getElements } = new DOMHelper();
        const { addTaskBtn } = getElements();
        // Adding Task
        addTaskBtn.addEventListener('click', () => {
            taskTracker.addTask();
            
            const { getElements } = new DOMHelper();
            const { deleteBtns } = getElements();

            // Deleting Task
            deleteBtns.forEach(deleteBtn => {
                deleteBtn.addEventListener('click', event => {

                    const taskToken  = event.target.closest('.task-controls')
                    .previousElementSibling.querySelector('.output')
                    .dataset.taskToken;

                    taskTracker.deleteTask(taskToken);

                })
            })

            // Editing task
            const { editBtns } = getElements();
            editBtns.forEach(editBtn => {
                editBtn.addEventListener('click', event => {

                    const outputElement = event.target.closest('.task-controls').previousElementSibling.querySelector('.output');
                    const inputElement = outputElement.nextElementSibling;

                    const taskToken  = event.target.closest('.task-controls')
                    .previousElementSibling.querySelector('.output')
                    .dataset.taskToken;
                    console.log(taskToken);

                    taskTracker.editTask(outputElement, inputElement, taskToken);
                })
            })
        });

    }

}

App.init();