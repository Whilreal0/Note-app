<script setup>
import { ref, reactive, onMounted } from "vue";
import { useDark, useToggle } from "@vueuse/core";
const showModal = ref(false);
const task = ref(""); //newNote
const isEditing = ref(false);
const selectedTask = ref(null);

const isDark = useDark();
const toggleDark = useToggle(isDark);

const randomColor = () => {
  return "hsl(" + Math.random() * 360 + ", 100%, 75%)";
};

// load task from localstorage
const loadTasks = () => {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
};
const tasks = reactive(loadTasks()); // Initialize task from localstorage
// Save tasks to local storage
// Add default tasks only if local storage is empty
if (tasks.length === 0) {
  tasks.push(
    {
      text: "Note Sample",
      date: new Date().toLocaleDateString(),
      backgroundColor: randomColor(),
    },
    {
      text: "Note Sample 2",
      date: new Date().toLocaleDateString(),
      backgroundColor: randomColor(),
    }
  );
}

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const addTask = () => {
  if (task.value.trim() === "") return;
  tasks.unshift({
    text: task.value, // Use task.value for the text
    date: new Date().toLocaleDateString(), // Format date for display
    backgroundColor: randomColor(),
  });
  saveTasks();
  task.value = ""; // Clear the input field
  showModal.value = false; // Close the modal after adding the task
};
const deleteTask = (i) => {
  tasks.splice(i, 1); // Remove the task at the specified index
  saveTasks(); // Save updated tasks to local storage
};
const editTask = (i) => {
  task.value = tasks[i].text;
  selectedTask.value = i;
  isEditing.value = true;
};
const updateTask = () => {
  if (task.value.trim() === "") return; // Prevent empty updates
  tasks[selectedTask.value] = {
    text: task.value,
    date: new Date().toLocaleDateString(),
    backgroundColor: randomColor(),
  };
  saveTasks(); // Save updated tasks to local storage
  isEditing.value = false;
  task.value = "";
  selectedTask.value = null; // Clear selected task after update
};
const openModal = () => {
  // Reset editing state when opening the modal
  let body = document.body;

  isEditing.value = false;
  selectedTask.value = null;
  task.value = ""; // Clear the input for new task
  // showModal.value = true; // Open the modal
  showModal.value = !showModal.value;
  showModal.value
    ? body.classList.add("overflow-hidden")
    : body.classList.remove("overflow-hidden");
};

onMounted(() => {
  isDark.value = true; // Force dark mode to be active on page load
});
const toggle = () => {
  isDark.value =! isDark.value

}
</script>

<template>
  <div class="container p-2" 
  >
    <div class="flex justify-between items-center mb-1.5 py-2 dark:text-[#c9a5fa] text-black">
      <span > 
        <button @click="toggle" class="">Quick Notes</button>
      </span>
      <button
        class="w-8 h-8 flex items-center justify-center text-2xl font-bold"
        @click="openModal"
      >
        +
      </button>
    </div>
    <div
      v-if="showModal"
      class="absolute inset-0 z-10 px-2 py-5 flex items-center justify-center"
    >
      <div class="bg-[#3f3f3f] dark:bg-[#121212]  rounded-md min-w-72 px-2 py-2 my-auto z-10">
        <form @submit.prevent="addTask" class="flex flex-col">
          <!-- <input class="rounded-md" v-model="task"  @keyup.enter="addTask" type="text" /> -->
          <textarea
            rows="4"
            class="rounded-md px-1 w-full"
            v-model="task"
            @keyup.enter="addTask"
          ></textarea>
          <button class="sm-submit-btn mt-2" type="submit">Submit</button>
        </form>
        <!-- <button class="sm-danger-btn w-full mt-2" @click="openModal">
          Close
        </button> -->
      </div>
      <div @click="openModal" class="absolute bg-black/80 inset-0">
        <!-- click bg to close -->
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div
        v-for="(item, i) in tasks"
        :key="i"
        class="p-2 min-h-24 flex flex-col justify-between rounded-md w-full"
        :style="{ backgroundColor: item.backgroundColor }"
      >
        <div v-if="!isEditing || selectedTask !== i" class="w-full mb-10">
          <span class="break-words">
            {{ item.text }}
          </span>
        </div>
        <div v-if="isEditing && selectedTask === i" class="w-full">
          <span>
            <textarea
              class="rounded-md px-1 w-full"
              v-model="task"
              @keyup.enter="updateTask"
              placeholder="edit task"
            ></textarea>
          </span>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex gap-2 justify-center items-center">
            <button
              v-if="!isEditing || selectedTask !== i"
              @click="editTask(i)"
            >
              <box-icon name="pencil" size="sm"></box-icon>
            </button>
            <button v-if="isEditing && selectedTask === i" @click="updateTask">
              Update
            </button>
            <button class="" @click="deleteTask(i)" c>
              <box-icon name="trash" size="sm"></box-icon>
            </button>
          </div>
          <div class="text-sm">{{ item.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
