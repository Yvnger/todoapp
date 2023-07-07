import { getStorageType, setStorageType, getOwner, setOwner } from './handlers.js';
import { updateTodoItem, deleteTodoItem } from './storages/storage.js';

export function createHeader() {
    const header = document.createElement('header')
    header.classList.add('header');

    const title = document.createElement('h1');
    title.classList.add('header__logo');
    title.innerText = 'Todo'

    header.append(title);

    return header;
}

export function createForm(placeholder = 'Введите что нибудь...') {
    const form = document.createElement('form');
    form.classList.add('form');

    const wrap = document.createElement('div');
    wrap.classList.add('form__wrap');

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'taskName'
    input.classList.add('form__input');
    input.placeholder = placeholder;

    const button = document.createElement('button');
    button.classList.add('btn', 'form__button');
    button.type = 'submit';
    button.setAttribute('aria-label', 'Добавить задачу');

    form.append(wrap);
    wrap.append(input);
    wrap.append(button);

    return { form, input };
}

export function createMainSection() {
    const section = document.createElement('section');
    section.classList.add('tasks');

    return section;
}

export function createList() {
    const list = document.createElement('ul');
    list.classList.add('tasks__list');

    return list;
}

export function createTask({ id, name, done }) {
    const doneClass = 'tasks__item_done';
    const changeEvent = new Event('updateStatus');

    const item = document.createElement('li');
    item.classList.add('tasks__item');

    const checkboxWrap = document.createElement('label');
    checkboxWrap.classList.add('checkbox');

    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';

    if (done) {
        setTaskStatus(item, done)
    }

    checkboxInput.addEventListener('change', async () => {
        setTaskStatus(item, !done)
        await updateTodoItem({ id, done });
    })

    const checkmark = document.createElement('span');
    checkmark.classList.add('checkbox__checkmark');

    const text = document.createElement('span');
    text.classList.add('tasks__text');
    text.innerText = name;

    const remove = document.createElement('button');
    remove.classList.add('btn', 'tasks__remove');
    remove.setAttribute('aria-label', 'Удалить задачу');

    remove.addEventListener('click', async () => {
        await deleteTodoItem(id);
        item.remove();
    })

    item.append(checkboxWrap);
    checkboxWrap.append(checkboxInput);
    checkboxWrap.append(checkmark);
    item.append(text);
    item.append(remove);

    function setTaskStatus(item, done) {
        if (done) {
            checkboxInput.checked = true;
            item.classList.add(doneClass);
        } else {
            checkboxInput.checked = true;
            item.classList.remove(doneClass);
        }
    }

    return { item, remove };
}

export function renderTaskList(tasks) {
    if (tasks) {
        const taskElements = tasks
            .filter(task => task.owner === getOwner()) // отбираем нужные элементы
            .map(task => createTask(task).item); // создаем элементы задачи

        return taskElements;
    }

    return [];
}

export function createOwners(items) {
    const selectedClass = 'tasks__owner-item_active';
    const currentOwner = getOwner();
    const changeEvent = new Event('ownerChanged');

    const footer = document.createElement('div');
    footer.classList.add('tasks__footer');

    const ownerList = document.createElement('ul');
    ownerList.classList.add('tasks__owner-list');

    for (let i = 0; i < items.length; i++) {
        const ownerItem = document.createElement('li');
        ownerItem.classList.add('tasks__owner-item');

        if (items[i].id === currentOwner) {
            ownerItem.classList.add(selectedClass);
        }

        const ownerItemLink = document.createElement('a');
        ownerItemLink.classList.add('tasks__owner-link');
        ownerItemLink.href = '#';
        ownerItemLink.innerText = items[i].name;

        ownerItemLink.addEventListener('click', event => {
            event.preventDefault();
            setOwner(items[i].id); // Назначаем нового владельца списка в localStorage
            setActiveElement(ownerItem, selectedClass); // Назначаем активный DOM элемент
            document.dispatchEvent(changeEvent); // Вызываем событие, которое будем отслеживать в главной функции
        });

        ownerItem.append(ownerItemLink);
        ownerList.append(ownerItem);
    }

    const clearLink = document.createElement('a');
    clearLink.classList.add('tasks__clear');
    clearLink.href = '#';
    clearLink.innerText = 'Очистить';

    clearLink.addEventListener('click', () => {
        localStorage.clear();
    })

    footer.append(ownerList);
    footer.append(clearLink);

    return footer;
}

export function createStorageList(items) {
    const selectedClass = 'tasks__storage-item_active';
    const currentStorageType = getStorageType();
    const changeEvent = new Event('storageChanged');

    const list = document.createElement('ul');
    list.classList.add('tasks__storage-list');

    for (let i = 0; i < items.length; i++) {
        const item = document.createElement('li');
        item.classList.add('tasks__storage-item');

        if (items[i].id === currentStorageType) {
            item.classList.add(selectedClass);
        }

        const link = document.createElement('a');
        link.classList.add('tasks__storage-link');
        link.href = '#';
        link.innerText = items[i].name;

        link.addEventListener('click', function (event) {
            event.preventDefault();
            setStorageType(items[i].id);
            setActiveElement(item, selectedClass); // Назначаем активный DOM элемент
            document.dispatchEvent(changeEvent); // Вызываем событие, которое будем отслеживать в главной функции
        });

        item.append(link);
        list.append(item);
    }

    return list;
}

// Общие функции для DOM элементов
function setActiveElement(item, selectedClass) {
    const currentItem = document.querySelector(`.${selectedClass}`);

    if (currentItem) {
        currentItem.classList.remove(selectedClass);
    }

    item.classList.add(selectedClass);
}