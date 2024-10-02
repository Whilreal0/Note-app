<script setup>
import { ref, reactive } from "vue";

const showModal = ref(false);
const task = ref('') //newNote
const isEditing = ref(false) 
const selectedTask = ref(null)
const tasks = reactive([]) //notes

const randomColor =() => {
  return "hsl(" + Math.random () * 360 + ", 100%, 75%)"
}

const addTask = ()=>{
  if(task.value.trim() === "") return
  tasks.push({
    text: task.value, // Use task.value for the text
    date: new Date().toLocaleDateString(), // Format date for display
    backgroundColor: randomColor()
  });
  task.value = ""; // Clear the input field
  showModal.value = false; // Close the modal after adding the task
  console.log(tasks);
}
const deleteTask = (i) => {
  tasks.splice(i, 1); // Remove the task at the specified index
}
const editTask = (i) => {
  task.value = tasks[i].text
  selectedTask.value = i
  isEditing.value = true
}
const updateTask = ()=> {
  if (task.value.trim() === "") return; // Prevent empty updates
  tasks[selectedTask.value] = {
    text: task.value,
    date: new Date().toLocaleDateString(),
    backgroundColor: randomColor()
  };
  isEditing.value = false;
  task.value = '';
  selectedTask.value = null; // Clear selected task after update
 
  
}
</script>

<template>
  <div class="container px-2 ">
    <div class="flex justify-between mb-5 px-2">
      <span>Note</span>
      <button @click="showModal = true">+</button>
    </div>
    <div  v-if="showModal" class="absolute inset-0   z-10 px-2 py-5 flex items-center justify-center">
      <div class="bg-blue-300 px-4 py-2 my-auto z-10">
        <form @submit.prevent="addTask"  class="flex flex-col">
          <input v-model="task" type="text" />
          <button type="submit">Add</button>
        </form>
        <button @click="showModal = false">close</button>
      </div>
      <div @click="showModal = false" class="absolute bg-black/80 inset-0">
      <!-- click bg to close -->
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div v-for="(item, i) in tasks" :key="i" class="px-2 min-h-24 flex flex-col justify-between rounded-md" :style="{backgroundColor : item.backgroundColor}">
        <div v-if="!isEditing || selectedTask !== i" class=" bg-red-300 w-full">
          <span>
            {{ item.text }}
          </span>
        </div>
        <div v-else class=" bg-red-300 w-full">
          <span>
            <input v-model="task" @keyup.enter="updateTask" type="text" placeholder="edit task">
          </span>
        </div>
       <div class="flex justify-between">
        <div class="flex gap-2">
          <button v-if="!isEditing" @click="editTask(i)">Edit</button>
          <button v-else @click="updateTask">Update</button>
          <button @click="deleteTask(i)">delete</button>
        </div>
        <div>{{ item.date }}</div>
       </div>
      </div>
    </div>
  </div>
</template>
