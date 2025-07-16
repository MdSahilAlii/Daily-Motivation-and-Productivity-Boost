
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  ImageBackground,
  SafeAreaView,
  Modal,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

// Sample motivational quotes
const motivationalQuotes = [
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    background: '#FF6B6B'
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    background: '#4ECDC4'
  },
  {
    text: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller",
    background: '#45B7D1'
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    background: '#96CEB4'
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    background: '#FFEAA7'
  }
];

// Productivity tips
const productivityTips = [
  "Start your day with the most important task",
  "Use the 2-minute rule: if it takes less than 2 minutes, do it now",
  "Break large tasks into smaller, manageable chunks",
  "Eliminate distractions during focused work sessions",
  "Take regular breaks to maintain productivity"
];

// Motivational reels data
const motivationalReels = [
  {
    id: 1,
    title: "Morning Motivation",
    content: "Every morning is a new opportunity to become better than yesterday. Rise up and chase your dreams!",
    background: '#FF6B6B'
  },
  {
    id: 2,
    title: "Success Mindset",
    content: "Success isn't about being perfect. It's about being consistent and never giving up on your goals.",
    background: '#4ECDC4'
  },
  {
    id: 3,
    title: "Growth Focus",
    content: "Your comfort zone is a beautiful place, but nothing ever grows there. Step out and embrace challenges!",
    background: '#45B7D1'
  },
  {
    id: 4,
    title: "Productivity Power",
    content: "Small daily improvements lead to stunning long-term results. Focus on progress, not perfection.",
    background: '#96CEB4'
  },
  {
    id: 5,
    title: "Dream Big",
    content: "The biggest risk is not taking any risk. Believe in yourself and take that first step today!",
    background: '#FFEAA7'
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [dailyQuote, setDailyQuote] = useState(motivationalQuotes[0]);
  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning Exercise', completed: false },
    { id: 2, name: 'Read 30 minutes', completed: false },
    { id: 3, name: 'Drink 8 glasses of water', completed: false }
  ]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [customMood, setCustomMood] = useState('');
  const [generatedQuote, setGeneratedQuote] = useState('');
  const [showAdModal, setShowAdModal] = useState(false);

  // Set daily quote based on current date
  useEffect(() => {
    const today = new Date().getDate();
    const quoteIndex = today % motivationalQuotes.length;
    setDailyQuote(motivationalQuotes[quoteIndex]);
  }, []);

  // Pomodoro timer effect
  useEffect(() => {
    let interval = null;
    if (isPomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(pomodoroTime - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsPomodoroActive(false);
      Alert.alert('Pomodoro Complete!', 'Great job! Take a 5-minute break.');
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
    // Show ad after habit completion
    if (!habits.find(h => h.id === habitId).completed) {
      showRewardAd('Habit completed! Here\'s your reward ad.');
    }
  };

  const generateCustomQuote = () => {
    if (!customMood.trim()) {
      Alert.alert('Please enter your mood or feeling');
      return;
    }
    
    // Simulate AI-generated quote based on mood
    const moodQuotes = {
      'tired': "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit. Then get back to work.",
      'motivated': "Your motivation today is the foundation of your success tomorrow. Keep that fire burning!",
      'stressed': "In the middle of difficulty lies opportunity. Take a deep breath and find your way through.",
      'happy': "Happiness is not by chance, but by choice. You're choosing to shine today!",
      'default': `When you're feeling ${customMood}, remember that every emotion is temporary, but your strength is permanent.`
    };
    
    const quote = moodQuotes[customMood.toLowerCase()] || moodQuotes.default;
    setGeneratedQuote(quote);
    
    // Show interstitial ad
    showRewardAd('Quote generated! Here\'s an ad for you.');
  };

  const showRewardAd = (message) => {
    setShowAdModal(true);
    setTimeout(() => {
      setShowAdModal(false);
      Alert.alert('Ad Complete', message);
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderHome = () => (
    <ScrollView style={styles.container}>
      <ImageBackground 
        source={{ uri: 'https://picsum.photos/400/200?random=1' }} 
        style={styles.quoteSection}
        imageStyle={styles.quoteBackgroundImage}
      >
        <View style={styles.quoteOverlay}>
          <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
          <Text style={styles.quoteAuthor}>- {dailyQuote.author}</Text>
          <TouchableOpacity 
            style={styles.adButton}
            onPress={() => showRewardAd('Daily quote viewed! Enjoy this ad.')}
          >
            <Text style={styles.adButtonText}>View Full Quote (Ad)</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Productivity Tip</Text>
        <Text style={styles.tipText}>
          {productivityTips[new Date().getDate() % productivityTips.length]}
        </Text>
      </View>

      <View style={styles.navigationGrid}>
        <TouchableOpacity 
          style={[styles.navButton, { backgroundColor: '#FF6B6B' }]}
          onPress={() => setCurrentView('habits')}
        >
          <Text style={styles.navButtonText}>Habit Tracker</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, { backgroundColor: '#4ECDC4' }]}
          onPress={() => setCurrentView('reels')}
        >
          <Text style={styles.navButtonText}>Motivation Reels</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, { backgroundColor: '#45B7D1' }]}
          onPress={() => setCurrentView('pomodoro')}
        >
          <Text style={styles.navButtonText}>Focus Timer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, { backgroundColor: '#96CEB4' }]}
          onPress={() => setCurrentView('generator')}
        >
          <Text style={styles.navButtonText}>Quote Generator</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderHabits = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView('home')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Habit Tracker</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Habits</Text>
        {habits.map(habit => (
          <TouchableOpacity 
            key={habit.id}
            style={[styles.habitItem, habit.completed && styles.habitCompleted]}
            onPress={() => toggleHabit(habit.id)}
          >
            <Text style={[styles.habitText, habit.completed && styles.habitTextCompleted]}>
              {habit.completed ? '✓' : '○'} {habit.name}
            </Text>
          </TouchableOpacity>
        ))}
        
        <View style={styles.habitStats}>
          <Text style={styles.statsText}>
            Completed: {habits.filter(h => h.completed).length}/{habits.length}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderReels = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView('home')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Motivation Reels</Text>
      </View>

      <ScrollView 
        pagingEnabled 
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / height);
          setCurrentReelIndex(index);
        }}
      >
        {motivationalReels.map((reel, index) => (
          <View 
            key={reel.id} 
            style={[styles.reelContainer, { backgroundColor: reel.background }]}
          >
            <Text style={styles.reelTitle}>{reel.title}</Text>
            <Text style={styles.reelContent}>{reel.content}</Text>
            
            <TouchableOpacity 
              style={styles.reelAdButton}
              onPress={() => showRewardAd('Reel viewed! Watch this ad to unlock more content.')}
            >
              <Text style={styles.reelAdButtonText}>Watch Ad for More Reels</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderPomodoro = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView('home')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Focus Timer</Text>
      </View>

      <View style={styles.pomodoroContainer}>
        <Text style={styles.pomodoroTitle}>Pomodoro Timer</Text>
        <Text style={styles.pomodoroTime}>{formatTime(pomodoroTime)}</Text>
        
        <TouchableOpacity 
          style={[styles.pomodoroButton, isPomodoroActive && styles.pomodoroButtonActive]}
          onPress={() => setIsPomodoroActive(!isPomodoroActive)}
        >
          <Text style={styles.pomodoroButtonText}>
            {isPomodoroActive ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.adButton}
          onPress={() => showRewardAd('Premium focus music unlocked with this ad!')}
        >
          <Text style={styles.adButtonText}>Watch Ad for Focus Music</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGenerator = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView('home')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quote Generator</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling today?</Text>
        
        <TextInput
          style={styles.moodInput}
          placeholder="Enter your mood (e.g., tired, motivated, stressed)"
          value={customMood}
          onChangeText={setCustomMood}
        />

        <TouchableOpacity 
          style={styles.generateButton}
          onPress={generateCustomQuote}
        >
          <Text style={styles.generateButtonText}>Generate Quote</Text>
        </TouchableOpacity>

        {generatedQuote ? (
          <View style={styles.generatedQuoteContainer}>
            <Text style={styles.generatedQuoteText}>"{generatedQuote}"</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar style="auto" />
      
      {currentView === 'home' && renderHome()}
      {currentView === 'habits' && renderHabits()}
      {currentView === 'reels' && renderReels()}
      {currentView === 'pomodoro' && renderPomodoro()}
      {currentView === 'generator' && renderGenerator()}

      {/* Ad Modal */}
      <Modal
        visible={showAdModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.adModalContainer}>
          <View style={styles.adModal}>
            <Text style={styles.adModalText}>📺 Advertisement</Text>
            <Text style={styles.adModalSubtext}>Loading ad content...</Text>
            <View style={styles.adLoadingBar}>
              <View style={styles.adLoadingProgress} />
            </View>
          </View>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    fontSize: 16,
    color: '#007bff',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
  },
  quoteSection: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteBackgroundImage: {
    borderRadius: 0,
  },
  quoteOverlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 15,
  },
  tipText: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 24,
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  navButton: {
    width: '48%',
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  habitItem: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#dee2e6',
  },
  habitCompleted: {
    backgroundColor: '#d4edda',
    borderLeftColor: '#28a745',
  },
  habitText: {
    fontSize: 16,
    color: '#343a40',
  },
  habitTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#28a745',
  },
  habitStats: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
  },
  reelContainer: {
    height: height - 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  reelTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  reelContent: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
  },
  reelAdButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 25,
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
    padding: 20,
  },
  pomodoroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 30,
  },
  pomodoroTime: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 40,
  },
  pomodoroButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 30,
  },
  pomodoroButtonActive: {
    backgroundColor: '#dc3545',
  },
  pomodoroButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  moodInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  generateButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generatedQuoteContainer: {
    backgroundColor: '#e7f3ff',
    padding: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  generatedQuoteText: {
    fontSize: 16,
    color: '#343a40',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  adButton: {
    backgroundColor: '#ffc107',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  adButtonText: {
    color: '#212529',
    fontSize: 14,
    fontWeight: 'bold',
  },
  adModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adModal: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
  },
  adModalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 10,
  },
  adModalSubtext: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
  },
  adLoadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    overflow: 'hidden',
  },
  adLoadingProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: 2,
  },
});
