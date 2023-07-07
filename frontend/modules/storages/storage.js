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
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            owner: owner
        })
    });
    const data = await response.json();
    console.log(data);
}

