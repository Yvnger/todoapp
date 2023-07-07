import { API_URL } from "../constants.js";
// // Функция для динамического импорта модуля
// async function importModule(filePath) {
//     try {
//       const module = await import(filePath);
//       return module;
//     } catch (error) {
//       console.error('Ошибка при загрузке модуля:', error);
//       throw error;
//     }
//   }

//   // Функция для обновления импортированного модуля
//   async function updateModule() {
//     // Получаем новое значение переменной из localStorage
//     const myVariable = localStorage.getItem('myVariable');
//     const filePath = `./${myVariable}.js`;

//     try {
//       // Динамический импорт нового модуля
//       const module = await importModule(filePath);

//       // Здесь вы можете использовать обновленный модуль
//       module.myFunction();
//     } catch (error) {
//       // Обработка ошибок при обновлении модуля
//       console.error('Ошибка при обновлении модуля:', error);
//     }
//   }


export async function loadTodoItems() {
    const response = await fetch(API_URL);
    const data = await response.json();

    return data;
}

export async function createTodoItem({ name, owner }) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                owner: owner
            })
        });
        const data = await response.json();
    } catch (error) {
        console.error('Error creating todo item:', error);
    }
}

export async function updateTodoItem({ id, done }) {
    const newStatus = !done;
    console.log(newStatus);
    const response = await fetch(API_URL + '/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: newStatus })
    });
    const data = await response.json();
    console.log(data);
}

export async function deleteTodoItem(id) {
    const response = await fetch(API_URL + '/' + id, {
        method: 'DELETE',
    });
    if (response.status === 404)
        console.log('Не удалось удалить дело, так как его не существует');
    const data = await response.json();
    console.log(data);
}