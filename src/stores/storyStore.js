import apiClient from '../services/apiClient.js'
import { toast } from 'vue3-toastify'

export const storyStore = {
  state: {
    currentStory: null,
    sentences: [],
    storyStatus: 'not_started', // 'not_started', 'in_progress', 'completed'
    currentSentenceCount: 0,
    error: null,
  },

  // Load state from localStorage (if available)
  loadStateFromLocalStorage() {
    const storedState = localStorage.getItem('story-state')
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState)
        this.state = { ...this.state, ...parsedState }
      } catch (error) {
        toast.error(error.message)
      }
    }
  },

  // Save state to localStorage
  saveStateToLocalStorage() {
    localStorage.setItem('story-state', JSON.stringify(this.state))
  },

  // Method to start the story
  async startStory(title) {
    try {
      const response = await apiClient.post('/stories/start_story', { title })
      this.state.currentStory = { id: response.data.story_id, title, guidance: response.data.guidance }
      this.state.storyStatus = 'in_progress'
      this.state.sentences = []
      this.state.currentSentenceCount = 0
      this.state.error = null

      // Persist the updated state
      this.saveStateToLocalStorage()

      return response.data
    } catch (error) {
      this.state.error = error.message
      toast.error(error.message)
      throw new Error(error.response?.data?.error || 'Failed to start story')
    }
  },

  // Method to add a sentence to the story
  async addSentence(sentence) {
    try {
      if (!this.state.currentStory) throw new Error('No current story found')

      const response = await apiClient.post(`/stories/${this.state.currentStory.id}/add_sentence`, {
        sentence
      })

      this.state.sentences.push(response.data.sentence)
      this.state.currentSentenceCount = this.state.sentences.length
      this.state.error = null

      // Persist the updated state
      this.saveStateToLocalStorage()

      return response.data
    } catch (error) {
      this.state.error = error.message
      toast.error(error.message)
      throw new Error(error.response?.data?.error || 'Failed to add sentence')
    }
  },

  // Method to complete the story
  async completeStory() {
    try {
      if (!this.state.currentStory) throw new Error('No current story found')

      const response = await apiClient.post(`/stories/${this.state.currentStory.id}/complete_story`)

      this.state.storyStatus = 'completed'
      this.state.error = null

      // Persist the updated state
      this.saveStateToLocalStorage()

      return response.data
    } catch (error) {
      this.state.error = error.message
      toast.error(error.message)
      throw new Error(error.response?.data?.error || 'Failed to complete story')
    }
  },

  // Method to fetch the progress of the story
  async getProgress() {
    try {
      const response = await apiClient.get('/stories/progress')
      return response.data
    } catch (error) {
      this.state.error = error.message
      toast.error(error.message)
      throw new Error(error.response?.data?.error || 'Failed to get progress')
    }
  },

  // Method to get all the stories
  async getAllStories() {
    try {
      const response = await apiClient.get('/stories')
      return response.data
    } catch (error) {
      this.state.error = error.message
      toast.error(error.message)
      throw new Error(error.response?.data?.error || 'Failed to get stories')
    }
  },

  // Method to clear the story state
  clearStory() {
    this.state.currentStory = null
    this.state.sentences = []
    this.state.storyStatus = 'not_started'
    this.state.currentSentenceCount = 0
    this.state.error = null

    // Clear the state from localStorage
    localStorage.removeItem('story-state')
  },

  // New method: Set the current story (when navigating to the Writing Tip view)
  setCurrentStory(story) {
    this.state.currentStory = story
    this.state.sentences = []
    this.state.storyStatus = 'not_started'
    this.state.currentSentenceCount = 0
    this.state.error = null
    this.saveStateToLocalStorage()
  },

  // New method: Get the current story
  getCurrentStory() {
    return this.state.currentStory
  }
}
