import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotifications, scheduleDailySuggestion } from "./utils/notifications";
import SplashScreen from "./screens/SplashScreen";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import LibraryScreen from "./screens/LibraryScreen";
import PostEditorScreen from "./screens/PostEditorScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import ProfileSetupScreen from "./screens/ProfileSetupScreen";
import CompetitiveIntelligenceScreen from "./screens/CompetitiveIntelligenceScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0A0F1E",
          borderTopColor: "#1E293B",
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: "#38BDF8",
        tabBarInactiveTintColor: "#334155",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />, tabBarLabel: "Home" }} />
      <Tab.Screen name="Library" component={LibraryScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="images" size={size} color={color} />, tabBarLabel: "Library" }} />
      <Tab.Screen name="PostEditor" component={PostEditorScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />, tabBarLabel: "Create" }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} />, tabBarLabel: "Analytics" }} />
      <Tab.Screen name="Intelligence" component={CompetitiveIntelligenceScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="telescope-outline" size={size} color={color} />, tabBarLabel: "Intel" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />, tabBarLabel: "Settings" }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  );
}

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications();

    // Schedule daily suggestion at 9am
    scheduleDailySuggestion();

    // Listen for incoming notifications while app is open
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Handle notification taps — navigate to correct screen
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data?.screen;
      if (screen && navigationRef.isReady()) {
        if (screen === 'PostEditor') {
          navigationRef.navigate('Main', { screen: 'PostEditor' });
        } else if (screen === 'Library') {
          navigationRef.navigate('Main', { screen: 'Library' });
        } else if (screen === 'Home') {
          navigationRef.navigate('Main', { screen: 'Home' });
        }
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="light" />
      <RootNavigator />
    </NavigationContainer>
  );
}
