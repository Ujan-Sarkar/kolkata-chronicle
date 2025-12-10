import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, RotateCcw } from 'lucide-react';
import { useStore } from '@/state/store';
import { HeritageButton } from '@/components/HeritageButton';
import type { TasteProfile } from '@/types';

const questions = [
  {
    id: 'time',
    question: 'What time of day speaks to your soul?',
    options: [
      { value: 'morning', label: 'Golden Morning', emoji: '🌅' },
      { value: 'afternoon', label: 'Lazy Afternoon', emoji: '☀️' },
      { value: 'evening', label: 'Twilight Hours', emoji: '🌆' },
      { value: 'night', label: 'Midnight Tales', emoji: '🌙' },
    ],
  },
  {
    id: 'vibe',
    question: 'Your ideal café mood?',
    options: [
      { value: 'cozy', label: 'Cozy & Intimate', emoji: '🕯️' },
      { value: 'aesthetic', label: 'Aesthetic & Pretty', emoji: '✨' },
      { value: 'classic', label: 'Classic & Heritage', emoji: '🏛️' },
      { value: 'modern', label: 'Modern & Minimal', emoji: '◻️' },
    ],
  },
  {
    id: 'drink',
    question: 'Your drink of choice?',
    options: [
      { value: 'coffee', label: 'Strong Coffee', emoji: '☕' },
      { value: 'tea', label: 'Delicate Tea', emoji: '🍵' },
      { value: 'chocolate', label: 'Hot Chocolate', emoji: '🍫' },
      { value: 'cold', label: 'Cold Brews', emoji: '🧊' },
    ],
  },
  {
    id: 'dessert',
    question: 'Sweet ending preference?',
    options: [
      { value: 'cake', label: 'Rich Cakes', emoji: '🎂' },
      { value: 'pastry', label: 'Flaky Pastries', emoji: '🥐' },
      { value: 'chocolate', label: 'All Chocolate', emoji: '🍫' },
      { value: 'light', label: 'Light & Fruity', emoji: '🍓' },
    ],
  },
  {
    id: 'company',
    question: 'Best enjoyed with?',
    options: [
      { value: 'solo', label: 'Just Myself', emoji: '📖' },
      { value: 'bestie', label: 'Best Friend', emoji: '👯' },
      { value: 'group', label: 'The Whole Gang', emoji: '🎉' },
      { value: 'date', label: 'Someone Special', emoji: '💕' },
    ],
  },
];

const personas: Record<string, TasteProfile> = {
  'classic-tea-solo': {
    persona: 'The Heritage Dreamer',
    description: 'You find solace in old-world charm. A book, a cup of Darjeeling, and the whisper of history is all you need.',
    vibe: 'Colonial clubs, Flurys at dawn, poetry corners',
    answers: {},
  },
  'aesthetic-chocolate-bestie': {
    persona: 'The Golden Hour Seeker',
    description: 'Beauty and friendship fuel your soul. You curate moments like art pieces, each café visit a story waiting to be shared.',
    vibe: 'Mrs. Magpie brunches, Instagram-worthy corners, sunlit afternoons',
    answers: {},
  },
  'cozy-coffee-date': {
    persona: 'The Romantic Nostalgic',
    description: 'Love and warmth guide your choices. Every cup is better when shared with someone who understands your soul.',
    vibe: 'Candlelit dinners, monsoon evenings, handwritten notes',
    answers: {},
  },
  'modern-cold-group': {
    persona: 'The Social Trendsetter',
    description: 'You bring the energy wherever you go. New spots, new experiences, and good company are your calling.',
    vibe: 'Rooftop cafés, weekend brunches, celebration vibes',
    answers: {},
  },
  default: {
    persona: 'The Kolkata Connoisseur',
    description: 'A unique blend of old and new, you appreciate the richness of heritage while embracing modern delights.',
    vibe: 'Park Street evenings, surprise discoveries, curated experiences',
    answers: {},
  },
};

const TasteProfilePage = () => {
  const { tasteProfile, setTasteProfile } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(!!tasteProfile);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate persona
      const key = `${answers.vibe || 'classic'}-${answers.drink || 'tea'}-${answers.company || 'solo'}`;
      const profile = personas[key] || personas.default;
      const finalProfile = { ...profile, answers };
      setTasteProfile(finalProfile);
      setShowResult(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const currentQuestion = questions[currentStep];
  const isAnswered = answers[currentQuestion?.id];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="label-caps text-primary">TASTE PROFILE</span>
        <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mt-2">
          Discover Your Palate
        </h1>
        <p className="font-serif-alt text-muted-foreground mt-2">
          A journey to understand your café soul.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Question {currentStep + 1} of {questions.length}
                </span>
                <span className="font-script text-primary">
                  {Math.round(((currentStep + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-secondary to-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                className="glass-card rounded-2xl p-8 md:p-12"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-serif-alt text-2xl md:text-3xl text-foreground text-center mb-8">
                  {currentQuestion.question}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {currentQuestion.options.map((option) => (
                    <motion.button
                      key={option.value}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        answers[currentQuestion.id] === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 bg-muted/30'
                      }`}
                      onClick={() => handleAnswer(currentQuestion.id, option.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-3xl mb-2 block">{option.emoji}</span>
                      <span className="font-body text-foreground">{option.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <HeritageButton
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </HeritageButton>

                  <HeritageButton
                    onClick={nextStep}
                    disabled={!isAnswered}
                  >
                    {currentStep === questions.length - 1 ? 'Reveal My Persona' : 'Next'}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </HeritageButton>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className="glass-card rounded-2xl p-8 md:p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Reveal animation */}
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="label-caps text-primary mb-2 block">You are</span>
              <h2 className="font-display text-3xl md:text-5xl text-gradient-gold mb-6">
                {tasteProfile?.persona}
              </h2>
              
              <p className="font-serif-alt text-xl text-muted-foreground max-w-lg mx-auto mb-8">
                {tasteProfile?.description}
              </p>

              <div className="inline-block p-6 rounded-xl bg-primary/10 border border-primary/30">
                <span className="label-caps block mb-2">Your Vibe</span>
                <p className="font-script text-primary text-xl">
                  {tasteProfile?.vibe}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <HeritageButton variant="ghost" onClick={restart}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Take Quiz Again
              </HeritageButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TasteProfilePage;
