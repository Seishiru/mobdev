import React from 'react';
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

const CompletedPage = ({ navigation, route }) => {
  const [isEditModalVisible, setEditModalVisible] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [editTaskTitle, setEditTaskTitle] = React.useState('');
  const [editTaskDescription, setEditTaskDescription] = React.useState('');
  const [completedTasks, setCompletedTasks] = React.useState([]);

  // Update completed tasks when receiving new ones from TodoPage
  React.useEffect(() => {
    if (route.params?.completedTasks) {
      setCompletedTasks(route.params.completedTasks);
    }
  }, [route.params?.completedTasks]);

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

  const deleteTask = (taskId) => {
    const updatedTasks = completedTasks.filter(task => task.id !== taskId);
    setCompletedTasks(updatedTasks);
    setEditModalVisible(false);
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
        {completedTasks.map(task => (
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
        ))}
      </ScrollView>

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
              style={styles.incompleteButton}
              onPress={() => markIncomplete(selectedTask)}
            >
              <Text style={styles.buttonText}>In complete</Text>
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
  taskList: {
    flex: 1,
    padding: 20,
  },
  taskItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
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
  completedText: {
    color: '#fff',
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
  updateButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  incompleteButton: {
    backgroundColor: '#9C27B0',
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

export default CompletedPage;
