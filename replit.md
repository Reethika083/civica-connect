# Civica Connect

## Overview
Interactive legal awareness mobile application built with Expo/React Native. Educates students and citizens about their fundamental rights, criminal procedures, and the Indian justice system through gamified simulations and quizzes.

## Recent Changes
- 2026-02-08: Initial build - Full app with Student Mode (FIR, Arrest, Remand simulations), Citizen Mode (Rights, Do's/Don'ts, Quiz), AR placeholder, score tracking

## Architecture
- **Frontend**: Expo Router (file-based routing), React Native
- **State**: AsyncStorage for score persistence
- **Theme**: Dark mode with black + purple + neon violet
- **Font**: Poppins (Google Fonts)
- **No backend required** - runs entirely offline

## Key Files
- `lib/data/legal_rules.json` - All legal rules, questions, citizen rights data
- `lib/services/decision_engine.ts` - Validates answers against JSON rules
- `lib/services/score_manager.ts` - XP, score, completion tracking with AsyncStorage
- `components/` - GlowCard, ChoiceCard, ScoreCard, CustomButton
- `app/index.tsx` - Home screen
- `app/student.tsx` - Student mode hub
- `app/simulation.tsx` - Simulation quiz screen (parameterized by type)
- `app/results.tsx` - Student simulation results
- `app/citizen.tsx` - Citizen mode with rights & do's/don'ts
- `app/citizen-quiz.tsx` - Citizen quiz
- `app/citizen-results.tsx` - Citizen quiz results with badge
- `app/ar-demo.tsx` - AR coming soon placeholder

## User Preferences
- Dark theme preferred
- Poppins font
- Neon violet + purple accent colors
