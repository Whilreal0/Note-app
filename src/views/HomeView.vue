<script setup>
import { ref, reactive } from "vue";

const showModal = ref(false);
const task = ref('') //newNote
const isEditing = ref(false) 
const selectedTask = ref(null)

const randomColor =() => {
  return "hsl(" + Math.random () * 360 + ", 100%, 75%)"
}
const tasks = reactive([
  {
    text: "Note Sample",
    date: new Date().toLocaleDateString(),
    backgroundColor: randomColor()
  },
  {
    text: "Note Sample 2",
    date: new Date().toLocaleDateString(),
    backgroundColor: randomColor()
  }
]) //notes



const addTask = ()=>{
  if(task.value.trim() === "") return
  tasks.unshift({
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
const openModal = () => {
  // Reset editing state when opening the modal
  isEditing.value = false;
  selectedTask.value = null;
  task.value = ''; // Clear the input for new task
  showModal.value = true; // Open the modal
};
</script>

<template>
  <div class="container px-2 ">
    <div class="flex justify-between items-center mb-5 py-2 px-2">
      <span>Note</span>
      <button class="bg-red-300 rounded-full w-8 aspect-square relative" @click="openModal"><span class="">+</span></button>
    </div>
    <div  v-if="showModal" class="absolute inset-0   z-10 px-2 py-5 flex items-center justify-center">
      <div class="bg-blue-300 rounded-md min-w-72 px-2 py-2 my-auto z-10">
        <form @submit.prevent="addTask"  class="flex flex-col">
          <input class="rounded-md" v-model="task" type="text" />
          <button type="submit">Add</button>
        </form>
        <button @click="showModal = false">close</button>
      </div>
      <div @click="showModal = false" class="absolute bg-black/80 inset-0">
      <!-- click bg to close -->
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div v-for="(item, i) in tasks" :key="i" class="p-2 min-h-24 flex flex-col justify-between rounded-md" :style="{backgroundColor : item.backgroundColor}">
        <div v-if="!isEditing || selectedTask !== i" class="  w-full">
          <span>
            {{ item.text }}
          </span>
        </div>
        <div v-if="isEditing && selectedTask === i" class="  w-full">
          <span>
            <input class="rounded-md px-1 w-full" v-model="task" @keyup.enter="updateTask" type="text" placeholder="edit task">
          </span>
        </div>
       <div class="flex justify-between">
        <div class="flex gap-2">
          <button v-if="!isEditing || selectedTask !== i" @click="editTask(i)">Edit</button>
          <button v-if="isEditing && selectedTask === i" @click="updateTask">Update</button>
          <button @click="deleteTask(i)">delete</button>
        </div>
        <div>{{ item.date }}</div>
       </div>
      </div>
    </div>
  </div>
</template>
