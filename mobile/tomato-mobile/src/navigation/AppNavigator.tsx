import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppStackParamList, BottomTabParamList } from './types';

// Placeholder for screens - to be implemented
const DashboardScreen = () => null;
const GardenScreen = () => null;
const TaskListScreen = () => null;
const TaskDetailScreen = () => null;
const CreateTaskScreen = () => null;
const EditTaskScreen = () => null;
const ProfileScreen = () => null;

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const TasksNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TaskList" component={TaskListScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
      <Stack.Screen name="EditTask" component={EditTaskScreen} />
    </Stack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Garden" component={GardenScreen} />
      <Tab.Screen name="Tasks" component={TasksNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
