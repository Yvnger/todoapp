import { createHeader, createForm, createMainSection, createList, createTask, renderTaskList, createOwners, createStorageList } from "./modules/elements.js";
import { OWNER_LIST, STORAGE_LIST } from './modules/constants.js';
import { getOwner } from './modules/handlers.js';
import { loadTodoItems, createTodoItem, updateTodoItem, deleteTodoItem } from "./modules/storages/storage.js";

(function () {
    const app = document.getElementById('app');

    async function createApp() {
        const header = createHeader();
        const input = createForm('Что нужно сделать?');
        const section = createMainSection();
        const list = createList();
        const owners = createOwners(OWNER_LIST);
        const storages = createStorageList(STORAGE_LIST);

        app.append(header);
        app.append(input.form);
        app.append(section);
        section.append(list);

        await reloadList();

        app.append(storages);

        section.append(owners);


        // Обрабатываем событие переключения владельца
        document.addEventListener('ownerChanged', async () => {
            await reloadList();
        })

        // Обрабатываем событие переключения хранилища
        document.addEventListener('storageChanged', async () => {
            await reloadList();
        })

        // Обрабатываем событие отправки формы
        input.form.addEventListener('submit', async event => {
            event.preventDefault();

            const taskName = input.form.elements['taskName'].value;

            try {
                createTodoItem({ name: taskName, owner: getOwner() });
            } catch (error) {
                console.error('Error creating todo item:', error);
            }

            input.form.reset();
        });


        async function reloadList() {
            const getTasks = await loadTodoItems();
            let taskElements = renderTaskList(getTasks); // получаем массив элементов задач
            list.innerHTML = '';
            list.append(...taskElements); // добавляем все элементы в список
        }
    }

    createApp();
})()