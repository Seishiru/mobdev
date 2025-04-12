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

const TodoPage = ({ navigation, route }) => {
  const [tasks, setTasks] = useState([]);
  const [isNewTaskModalVisible, setNewTaskModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);

  // Handle incoming incomplete task from CompletedPage
  useEffect(() => {
    if (route.params?.incompleteTask) {
      setTasks([...tasks, route.params.incompleteTask]);
      setCompletedTasks(route.params.updatedCompletedTasks);
    }
  }, [route.params?.incompleteTask]);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: newTaskDescription,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskModalVisible(false);
    }
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
    setEditModalVisible(true);
  };

  const updateTask = () => {
    if (editTaskTitle.trim()) {
      const updatedTasks = tasks.map(task =>
        task.id === selectedTask.id
          ? { ...task, title: editTaskTitle, description: editTaskDescription }
          : task
      );
      setTasks(updatedTasks);
      setEditModalVisible(false);
    }
  };

  const toggleComplete = (taskId) => {
    const taskToComplete = tasks.find(task => task.id === taskId);
    if (taskToComplete) {
      // Remove from tasks
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);

      // Add to completed tasks
      const completedTask = { ...taskToComplete, completed: true };
      const updatedCompletedTasks = [...completedTasks, completedTask];
      setCompletedTasks(updatedCompletedTasks);

      // Navigate to CompletedPage with the updated lists
      navigation.navigate('Completed', { 
        completedTasks: updatedCompletedTasks 
      });
    }
    setEditModalVisible(false);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    setEditModalVisible(false);
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToCompleted = () => {
    navigation.navigate('Completed', { completedTasks });
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
        {tasks.map(task => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskItem}
            onPress={() => openEditModal(task)}
          >
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDescription}>{task.description}</Text>
            </View>
            <View style={styles.taskActions}>
              <TouchableOpacity onPress={() => toggleComplete(task.id)}>
                <Ionicons
                  name={task.completed ? "checkmark-circle" : "checkmark-circle-outline"}
                  size={24}
                  color={task.completed ? "#4CAF50" : "#FFD700"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(task.id)}>
                <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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

      {/* Edit Task Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={editTaskTitle}
              onChangeText={setEditTaskTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detail/Description"
              value={editTaskDescription}
              onChangeText={setEditTaskDescription}
              multiline
            />
            <TouchableOpacity style={styles.updateButton} onPress={updateTask}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => toggleComplete(selectedTask?.id)}
            >
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTask(selectedTask?.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
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
        <TouchableOpacity style={styles.navItem} onPress={navigateToCompleted}>
          <Ionicons name="checkmark-circle" size={24} color="#000" />
          <Text>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={navigateToProfile}>
          <Ionicons name="person" size={24} color="#000" />
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A3780',
  },
  newTaskButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newTaskButtonText: {
    color: '#000',
    fontWeight: '500',
  },
  taskList: {
    flex: 1,
    padding: 20,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  taskDescription: {
    color: '#666',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontWeight: '500',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#FFD700',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  navItem: {
    alignItems: 'center',
  },
});

export default TodoPage;
