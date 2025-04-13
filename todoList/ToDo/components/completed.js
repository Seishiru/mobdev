import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert // Add this import
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './CompletedPageStyles';

const CompletedPage = ({ navigation }) => {
  const [isEditModalVisible, setEditModalVisible] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [editTaskTitle, setEditTaskTitle] = React.useState('');
  const [editTaskDescription, setEditTaskDescription] = React.useState('');
  const [completedTasks, setCompletedTasks] = React.useState([]);

  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch('http://localhost/todo_api/displaycomplete.php');
      
      // First check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON: ${text}`);
      }
      
      const data = await response.json();

      if (data.success) {
        setCompletedTasks(data.completedTasks);
      } else {
        console.error("Error fetching tasks:", data.error);
        Alert.alert("Error", data.error || "Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      Alert.alert("Error", "Could not connect to server. Please try again later.");
    }
  };

  React.useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const openEditModal = (task) => {
    setSelectedTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
    setEditModalVisible(true);
  };

  const updateTask = () => {
    if (editTaskTitle.trim()) {
      const updatedTasks = completedTasks.map(task =>
        task.id === selectedTask.id
          ? { ...task, title: editTaskTitle, description: editTaskDescription }
          : task
      );
      setCompletedTasks(updatedTasks);
      setEditModalVisible(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch('http://localhost/todo_api/deleteCompleteTask.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id: taskId
        }),
      });
  
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON: ${text}`);
      }
  
      const result = await response.json();
  
      if (result.success) {
        // Update local state only after successful server deletion
        const updatedTasks = completedTasks.filter(task => task.id !== taskId);
        setCompletedTasks(updatedTasks);
        Alert.alert("Success", "Task deleted successfully");
      } else {
        Alert.alert("Error", result.error || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      Alert.alert("Error", "Could not connect to server. Please try again later.");
    }
  };

  const markIncomplete = (task) => {
    // Remove from completed tasks
    const updatedCompletedTasks = completedTasks.filter(t => t.id !== task.id);
    setCompletedTasks(updatedCompletedTasks);

    // Mark as incomplete and send back to TodoPage
    const incompleteTask = { ...task, completed: false };
    navigation.navigate('TodoPage', {
      incompleteTask,
      updatedCompletedTasks
    });
    setEditModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Completed Tasks</Text>
      </View>

      <ScrollView style={styles.taskList}>
        {completedTasks.length === 0 ? (
          <Text style={styles.noTasksText}>No completed tasks</Text>
        ) : (
          completedTasks.map(task => (
            <TouchableOpacity
              key={task.id}
              style={[styles.taskItem, { backgroundColor: '#4CAF50' }]}
              onPress={() => openEditModal(task)}
            >
              <View style={styles.taskContent}>
                <Text style={[styles.taskTitle, styles.completedText]}>{task.title}</Text>
                <Text style={[styles.taskDescription, styles.completedText]}>{task.description}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteTask(task.id)}>
                <Ionicons name="trash-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Edit Task Modal */}
      <Modal visible={isEditModalVisible} transparent animationType="slide">
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
              style={styles.incompleteButton}
              onPress={() => markIncomplete(selectedTask)}
            >
              <Text style={styles.buttonText}>Mark Incomplete</Text>
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
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('TodoPage')}
        >
          <Ionicons name="list" size={24} color="#000" />
          <Text>To do</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="checkmark-circle" size={24} color="#000" />
          <Text>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person" size={24} color="#000" />
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CompletedPage;
