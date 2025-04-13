import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './TodoPageStyles'; // Assuming you have a separate file for styles

const TodoPage = ({ navigation, route }) => {
  const [tasks, setTasks] = useState([]);
  const [isNewTaskModalVisible, setNewTaskModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // Fetch tasks from the backend when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost/todo_api/getTasks.php'); // Replace with your server URL
      const data = await response.json();

      console.log("Fetched data: ", data); // Debugging statement to inspect fetched data

      // Ensure the response is an array, default to empty array if it's not
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (newTaskTitle.trim()) {
      const task = {
        title: newTaskTitle,
        description: newTaskDescription,
      };

      try {
        const response = await fetch('http://localhost/todo_api/createTask.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        });

        const result = await response.json();

        console.log("Task creation response: ", result); // Debugging statement to inspect task creation result

        if (result.message) {
          // Task successfully created, refresh task list
          fetchTasks();
          setNewTaskTitle('');
          setNewTaskDescription('');
          setNewTaskModalVisible(false);
        } else {
          console.error('Error creating task:', result.error);
        }
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  };

  const markTaskAsCompleted = async (taskId) => {
    console.log('Marking task as completed. Task ID:', taskId);  // Debug: Check task ID passed
  
    try {
      const response = await fetch('http://localhost/todo_api/check.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id: taskId,
          status: 'completed',
        }),
      });
  
      console.log('Response from server:', response); // Debug: Check the raw response from the server
  
      const result = await response.json();
      
      console.log('Parsed response JSON:', result); // Debug: Check the JSON content after parsing
  
      if (result.message) {
        console.log('Task marked as completed:', taskId); // Debug: Check if task was marked as completed
  
        // If task was successfully marked as completed, update the task in state
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? { ...task, status: 'completed' } : task
        );
        setTasks(updatedTasks);
        
        console.log('Updated tasks:', updatedTasks); // Debug: Check the updated tasks state
  
        // Optionally, send the updated tasks to the Completed tab
        const completedTasks = updatedTasks.filter((task) => task.status === 'completed');
        navigation.navigate('Completed', { completedTasks });
      } else {
        console.error('Error marking task as completed:', result.error);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost/todo_api/deleteTask.php?id=${taskId}`, {
        method: 'GET', // Use GET method to send the task ID for deletion
      });

      const result = await response.json();
      console.log("Task deletion response: ", result); // Debugging statement to inspect task deletion result

      if (result.success) {
        // Successfully deleted, remove the task from state
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        console.error('Error deleting task:', result.message);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TO-DO!</Text>
        <TouchableOpacity
          style={styles.newTaskButton}
          onPress={() => setNewTaskModalVisible(true)}
        >
          <Text style={styles.newTaskButtonText}>+ New task</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.taskList}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDescription}>{task.description}</Text>
              </View>
              <View style={styles.taskActions}>
                <TouchableOpacity onPress={() => markTaskAsCompleted(task.id)}>
                  <Ionicons
                    name={task.status === 'completed' ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={24}
                    color={task.status === 'completed' ? '#4CAF50' : '#FFD700'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(task.id)}>
                  <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noTasksText}>No tasks available</Text>
        )}
      </ScrollView>

      {/* New Task Modal */}
      <Modal
        visible={isNewTaskModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Task</Text>
              <TouchableOpacity onPress={() => setNewTaskModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detail/Description"
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              multiline
            />
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="list" size={24} color="#000" />
          <Text>To do</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Completed')}
        >
          <Ionicons name="checkmark-circle" size={24} color="#000" />
          <Text>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#000" />
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TodoPage;
