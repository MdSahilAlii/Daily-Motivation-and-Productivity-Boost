
import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Pressable, 
  TextInput, 
  Alert,
  ImageBackground,
  SafeAreaView,
  Modal,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Sample motivational quotes with gradients
const motivationalQuotes = [
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    gradient: ['#FF6B6B', '#FF8E53']
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    gradient: ['#4ECDC4', '#44A08D']
  },
  {
    text: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller",
    gradient: ['#45B7D1', '#96C93D']
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    gradient: ['#96CEB4', '#FFECD2']
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    gradient: ['#FFEAA7', '#FDCB6E']
  }
];

// Productivity tips
const productivityTips = [
  "🎯 Start your day with the most important task",
  "⚡ Use the 2-minute rule: if it takes less than 2 minutes, do it now",
  "🧩 Break large tasks into smaller, manageable chunks",
  "🔕 Eliminate distractions during focused work sessions",
  "☕ Take regular breaks to maintain productivity"
];

// Motivational reels data with gradients
const motivationalReels = [
  {
    id: 1,
    title: "Morning Motivation",
    content: "Every morning is a new opportunity to become better than yesterday. Rise up and chase your dreams!",
    gradient: ['#FF6B6B', '#FF8E53'],
    emoji: '🌅'
  },
  {
    id: 2,
    title: "Success Mindset",
    content: "Success isn't about being perfect. It's about being consistent and never giving up on your goals.",
    gradient: ['#4ECDC4', '#44A08D'],
    emoji: '🎯'
  },
  {
    id: 3,
    title: "Growth Focus",
    content: "Your comfort zone is a beautiful place, but nothing ever grows there. Step out and embrace challenges!",
    gradient: ['#45B7D1', '#96C93D'],
    emoji: '🌱'
  },
  {
    id: 4,
    title: "Productivity Power",
    content: "Small daily improvements lead to stunning long-term results. Focus on progress, not perfection.",
    gradient: ['#96CEB4', '#FFECD2'],
    emoji: '⚡'
  },
  {
    id: 5,
    title: "Dream Big",
    content: "The biggest risk is not taking any risk. Believe in yourself and take that first step today!",
    gradient: ['#FFEAA7', '#FDCB6E'],
    emoji: '✨'
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [dailyQuote, setDailyQuote] = useState(motivationalQuotes[0]);
  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning Exercise', completed: false, emoji: '🏃‍♀️' },
    { id: 2, name: 'Read 30 minutes', completed: false, emoji: '📚' },
    { id: 3, name: 'Drink 8 glasses of water', completed: false, emoji: '💧' }
  ]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [customMood, setCustomMood] = useState('');
  const [generatedQuote, setGeneratedQuote] = useState('');
  const [showAdModal, setShowAdModal] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Set daily quote based on current date
  useEffect(() => {
    const today = new Date().getDate();
    const quoteIndex = today % motivationalQuotes.length;
    setDailyQuote(motivationalQuotes[quoteIndex]);
  }, []);

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ]).start();
  }, [currentView]);

  // Pulse animation for active states
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      ])
    );
    
    if (isPomodoroActive) {
      pulse.start();
    } else {
      pulse.stop();
      pulseAnim.setValue(1);
    }
    
    return () => pulse.stop();
  }, [isPomodoroActive]);

  // Pomodoro timer effect
  useEffect(() => {
    let interval = null;
    if (isPomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(pomodoroTime - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsPomodoroActive(false);
      Alert.alert('🎉 Pomodoro Complete!', 'Great job! Take a 5-minute break.');
      setPomodoroTime(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isPomodoroActive, pomodoroTime]);

  const toggleHabit = (habitId) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed }
        : habit
    ));
    
    if (!habits.find(h => h.id === habitId).completed) {
      showRewardAd('🎉 Habit completed! Here\'s your reward ad.');
    }
  };

  const generateCustomQuote = () => {
    if (!customMood.trim()) {
      Alert.alert('💭 Please enter your mood or feeling');
      return;
    }
    
    const moodQuotes = {
      'tired': "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit. Then get back to work. 💤",
      'motivated': "Your motivation today is the foundation of your success tomorrow. Keep that fire burning! 🔥",
      'stressed': "In the middle of difficulty lies opportunity. Take a deep breath and find your way through. 🧘‍♀️",
      'happy': "Happiness is not by chance, but by choice. You're choosing to shine today! ☀️",
      'default': `When you're feeling ${customMood}, remember that every emotion is temporary, but your strength is permanent. 💪`
    };
    
    const quote = moodQuotes[customMood.toLowerCase()] || moodQuotes.default;
    setGeneratedQuote(quote);
    
    showRewardAd('✨ Quote generated! Here\'s an ad for you.');
  };

  const showRewardAd = (message) => {
    setShowAdModal(true);
    setTimeout(() => {
      setShowAdModal(false);
      Alert.alert('🎬 Ad Complete', message);
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const AnimatedPressable = ({ children, style, onPress, gradient }) => {
    const animValue = useRef(new Animated.Value(1)).current;
    
    const handlePressIn = () => {
      Animated.spring(animValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };
    
    const handlePressOut = () => {
      Animated.spring(animValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };
    
    return (
      <Animated.View style={{ transform: [{ scale: animValue }] }}>
        <Pressable
          style={style}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {gradient ? (
            <LinearGradient colors={gradient} style={StyleSheet.absoluteFillObject} />
          ) : null}
          {children}
        </Pressable>
      </Animated.View>
    );
  };

  const renderHome = () => (
    <Animated.View style={{ 
      flex: 1, 
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }, { translateY: slideAnim }]
    }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient 
          colors={dailyQuote.gradient}
          style={styles.quoteSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.quoteOverlay}>
            <Text style={styles.quoteEmoji}>✨</Text>
            <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {dailyQuote.author}</Text>
            <AnimatedPressable 
              style={styles.modernButton}
              onPress={() => showRewardAd('📖 Daily quote viewed! Enjoy this ad.')}
            >
              <Text style={styles.modernButtonText}>View Full Quote</Text>
            </AnimatedPressable>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Today's Productivity Tip</Text>
          <Text style={styles.tipText}>
            {productivityTips[new Date().getDate() % productivityTips.length]}
          </Text>
        </View>

        <View style={styles.navigationGrid}>
          <AnimatedPressable 
            style={[styles.navButton]}
            gradient={['#FF6B6B', '#FF8E53']}
            onPress={() => setCurrentView('habits')}
          >
            <Text style={styles.navButtonEmoji}>✅</Text>
            <Text style={styles.navButtonText}>Habit Tracker</Text>
          </AnimatedPressable>
          
          <AnimatedPressable 
            style={[styles.navButton]}
            gradient={['#4ECDC4', '#44A08D']}
            onPress={() => setCurrentView('reels')}
          >
            <Text style={styles.navButtonEmoji}>🎬</Text>
            <Text style={styles.navButtonText}>Motivation Reels</Text>
          </AnimatedPressable>
          
          <AnimatedPressable 
            style={[styles.navButton]}
            gradient={['#45B7D1', '#96C93D']}
            onPress={() => setCurrentView('pomodoro')}
          >
            <Text style={styles.navButtonEmoji}>⏰</Text>
            <Text style={styles.navButtonText}>Focus Timer</Text>
          </AnimatedPressable>
          
          <AnimatedPressable 
            style={[styles.navButton]}
            gradient={['#96CEB4', '#FFECD2']}
            onPress={() => setCurrentView('generator')}
          >
            <Text style={styles.navButtonEmoji}>🎯</Text>
            <Text style={styles.navButtonText}>Quote Generator</Text>
          </AnimatedPressable>
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderHabits = () => (
    <Animated.View style={{ 
      flex: 1, 
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient 
          colors={['#667eea', '#764ba2']} 
          style={styles.header}
        >
          <Pressable onPress={() => setCurrentView('home')}>
            <Text style={styles.backButton}>← Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>✅ Habit Tracker</Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          {habits.map(habit => (
            <AnimatedPressable 
              key={habit.id}
              style={[styles.habitItem, habit.completed && styles.habitCompleted]}
              onPress={() => toggleHabit(habit.id)}
            >
              <Text style={styles.habitEmoji}>{habit.emoji}</Text>
              <Text style={[styles.habitText, habit.completed && styles.habitTextCompleted]}>
                {habit.completed ? '✓' : '○'} {habit.name}
              </Text>
            </AnimatedPressable>
          ))}
          
          <LinearGradient 
            colors={['#f093fb', '#f5576c']}
            style={styles.habitStats}
          >
            <Text style={styles.statsText}>
              🎯 Completed: {habits.filter(h => h.completed).length}/{habits.length}
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderReels = () => (
    <Animated.View style={{ 
      flex: 1, 
      opacity: fadeAnim 
    }}>
      <LinearGradient 
        colors={['#667eea', '#764ba2']} 
        style={styles.header}
      >
        <Pressable onPress={() => setCurrentView('home')}>
          <Text style={styles.backButton}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>🎬 Motivation Reels</Text>
      </LinearGradient>

      <ScrollView 
        pagingEnabled 
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / (height - 100));
          setCurrentReelIndex(index);
        }}
      >
        {motivationalReels.map((reel, index) => (
          <LinearGradient
            key={reel.id}
            colors={reel.gradient}
            style={styles.reelContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.reelEmoji}>{reel.emoji}</Text>
            <Text style={styles.reelTitle}>{reel.title}</Text>
            <Text style={styles.reelContent}>{reel.content}</Text>
            
            <AnimatedPressable 
              style={styles.reelAdButton}
              onPress={() => showRewardAd('🎬 Reel viewed! Watch this ad to unlock more content.')}
            >
              <Text style={styles.reelAdButtonText}>Watch Ad for More Reels</Text>
            </AnimatedPressable>
          </LinearGradient>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderPomodoro = () => (
    <Animated.View style={{ 
      flex: 1, 
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }}>
      <LinearGradient 
        colors={['#667eea', '#764ba2']} 
        style={styles.header}
      >
        <Pressable onPress={() => setCurrentView('home')}>
          <Text style={styles.backButton}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>⏰ Focus Timer</Text>
      </LinearGradient>

      <LinearGradient 
        colors={['#ffecd2', '#fcb69f']}
        style={styles.pomodoroContainer}
      >
        <Text style={styles.pomodoroTitle}>🍅 Pomodoro Timer</Text>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Text style={styles.pomodoroTime}>{formatTime(pomodoroTime)}</Text>
        </Animated.View>
        
        <AnimatedPressable 
          style={[styles.pomodoroButton, isPomodoroActive && styles.pomodoroButtonActive]}
          gradient={isPomodoroActive ? ['#e74c3c', '#c0392b'] : ['#27ae60', '#2ecc71']}
          onPress={() => setIsPomodoroActive(!isPomodoroActive)}
        >
          <Text style={styles.pomodoroButtonText}>
            {isPomodoroActive ? '⏸️ Pause' : '▶️ Start'}
          </Text>
        </AnimatedPressable>

        <AnimatedPressable 
          style={styles.modernButton}
          gradient={['#f093fb', '#f5576c']}
          onPress={() => showRewardAd('🎵 Premium focus music unlocked with this ad!')}
        >
          <Text style={styles.modernButtonText}>🎵 Watch Ad for Focus Music</Text>
        </AnimatedPressable>
      </LinearGradient>
    </Animated.View>
  );

  const renderGenerator = () => (
    <Animated.View style={{ 
      flex: 1, 
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient 
          colors={['#667eea', '#764ba2']} 
          style={styles.header}
        >
          <Pressable onPress={() => setCurrentView('home')}>
            <Text style={styles.backButton}>← Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>🎯 Quote Generator</Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💭 How are you feeling today?</Text>
          
          <TextInput
            style={styles.moodInput}
            placeholder="Enter your mood (e.g., tired, motivated, stressed)"
            placeholderTextColor="#999"
            value={customMood}
            onChangeText={setCustomMood}
          />

          <AnimatedPressable 
            style={styles.generateButton}
            gradient={['#667eea', '#764ba2']}
            onPress={generateCustomQuote}
          >
            <Text style={styles.generateButtonText}>✨ Generate Quote</Text>
          </AnimatedPressable>

          {generatedQuote ? (
            <LinearGradient 
              colors={['#a8edea', '#fed6e3']}
              style={styles.generatedQuoteContainer}
            >
              <Text style={styles.generatedQuoteText}>"{generatedQuote}"</Text>
            </LinearGradient>
          ) : null}
        </View>
      </ScrollView>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar style="light" />
      
      {currentView === 'home' && renderHome()}
      {currentView === 'habits' && renderHabits()}
      {currentView === 'reels' && renderReels()}
      {currentView === 'pomodoro' && renderPomodoro()}
      {currentView === 'generator' && renderGenerator()}

      <Modal
        visible={showAdModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.adModalContainer}>
          <LinearGradient 
            colors={['#667eea', '#764ba2']}
            style={styles.adModal}
          >
            <Text style={styles.adModalText}>📺 Advertisement</Text>
            <Text style={styles.adModalSubtext}>Loading premium content...</Text>
            <View style={styles.adLoadingBar}>
              <LinearGradient 
                colors={['#f093fb', '#f5576c']}
                style={styles.adLoadingProgress}
              />
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    fontSize: 18,
    color: '#fff',
    marginRight: 15,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  quoteSection: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  quoteOverlay: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
  },
  quoteEmoji: {
    fontSize: 40,
    marginBottom: 15,
  },
  quoteText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 28,
  },
  quoteAuthor: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  tipText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    fontWeight: '500',
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  navButton: {
    width: '48%',
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  navButtonEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  habitCompleted: {
    backgroundColor: '#d4edda',
    borderLeftColor: '#28a745',
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  habitText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 1,
  },
  habitTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#28a745',
  },
  habitStats: {
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    overflow: 'hidden',
  },
  statsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  reelContainer: {
    height: height - 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  reelEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  reelTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
  },
  reelContent: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 50,
    fontWeight: '500',
  },
  reelAdButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 18,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  reelAdButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pomodoroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  pomodoroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 40,
  },
  pomodoroTime: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 50,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  pomodoroButton: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 30,
    marginBottom: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  pomodoroButtonActive: {
    shadowColor: '#e74c3c',
  },
  pomodoroButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  moodInput: {
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 15,
    padding: 20,
    fontSize: 16,
    marginBottom: 25,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  generateButton: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  generatedQuoteContainer: {
    padding: 25,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#667eea',
    overflow: 'hidden',
  },
  generatedQuoteText: {
    fontSize: 18,
    color: '#2c3e50',
    fontStyle: 'italic',
    lineHeight: 28,
    fontWeight: '500',
  },
  modernButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  modernButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  adModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adModal: {
    padding: 40,
    borderRadius: 25,
    alignItems: 'center',
    width: '85%',
    overflow: 'hidden',
  },
  adModalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  adModalSubtext: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
    opacity: 0.8,
  },
  adLoadingBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  adLoadingProgress: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
  },
});
