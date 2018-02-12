import userApi from '../../api/user-api'
import * as types from '../mutation-types'
import router from '../../router/index'

// initial state
const state = {
  // me
  me: {},
  // other
  is_login: false,
}

// getters
const getters = {
  is_login: state => state.is_login,
  verification_level: state => state.me.verification_level,
  me: state => {
    if (state.is_login && state.me) return state.me
    return {}
  },
  me_phone: state => {
    if (state.is_login && state.me) return state.me.user.phone_country_code + state.me.user.phone
    return {}
  },
  me_name: state => {
    if (state.is_login) return state.me.first_name + ' ' + state.me.last_name
    return ''
  },
}

// actions
const actions = {
  // Auth
  signup({ commit, dispatch }, form_data) {
    return userApi.signup(form_data)
      .then((response) => {
        commit(types.REGISTER_SUCCESS, response)
        return Promise.resolve()
      })
      .catch(error => Promise.reject(error))
  },
  login({ commit, dispatch }, form_data) {
    return userApi.login(form_data)
      .then((response) => {
        commit(types.LOGIN_SUCCESS)
        return Promise.resolve(response)
      })
      .catch(error => {
        commit(types.LOGIN_FAILED)
        return Promise.reject(error)
      })
  },
  login_2factor({ commit, dispatch }, form_data) {
    return userApi.login_2factor(form_data)
      .then((response) => {
        commit(types.LOGIN_2FACTOR_SUCCESS, response)
        dispatch('getWallet').then(() => Promise.resolve())
      })
      .catch(error => {
        commit(types.LOGIN_2FACTOR_FAILED)
        return Promise.reject(error)
      })
  },
  logout({ commit }) {
    userApi.logout()
      .then(() => {
        commit(types.LOGOUT)
      })
  },
  refresh({ commit }) {
    userApi.refresh()
      .then((response) => {
        commit(types.REFRESH_SUCCESS, response)
        return Promise.resolve()
      })
      .catch((error) => {
        commit(types.REFRESH_FAILED)
        return Promise.reject(error)
      })
  },

  // Load Data
  getMe({ commit }) {
    return userApi.getMe()
      .then((response) => {
        commit(types.LOAD_ME, response)
        return Promise.resolve()
      })
      .catch(error => Promise.reject(error))
  },
  updateMe({ commit }, form_data) {
    return userApi.updateMe(form_data)
      .then(() => {
        commit(types.UPDATE_ME)
        return Promise.resolve()
      })
      .catch(error => Promise.reject(error))
  },

  // Sign Up Follow Up
  confirmEmail({ dispatch, commit }, form_data) {
    return userApi.confirmEmail(form_data)
      .then(() => {
        dispatch('getMe')
        commit(types.CONFIRM_EMAIL_SUCCESS)
        return Promise.resolve()
      })
      .catch(error => Promise.reject(error))
  },
  addPhone({ dispatch, commit }, form_data) {
    return userApi.addPhone(form_data)
      .then(() => {
        commit(types.SEND_PHONE_CODE_SUCCESS)
        return Promise.resolve()
      })
      .catch(error => Promise.reject(error))
  },
  confirmPhone({ dispatch, commit }, form_data) {
    return userApi.confirmPhone(form_data)
      .then(() => {
        dispatch('getMe')
        commit(types.CONFIRM_PHONE_SUCCESS)
        return Promise.resolve()
      })
      .catch(error => Promise.reject(error))
  },
  addWalletAddress({ dispatch, commit }, form_data) {
    return userApi.addWalletAddress(form_data)
      .then(() => {
        commit(types.ADD_WALLET_ADDRESS_SUCCESS)
        return Promise.resolve()
      })
      .catch(error => Promise.reject(error))
  },
  uploadID({ dispatch, commit }, form_data) {
    return userApi.uploadID(form_data)
      .then(() => {
        commit(types.UPLOAD_ID)
        return Promise.resolve()
      })
      .catch(error => Promise.reject(error))
  },
  changePassword({}, form_data) {
    return userApi.changePassword(form_data)
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error))
  },
  forgetPasswordSendEmail({}, email) {
    return userApi.forgetPasswordSendEmail(email)
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error))
  },
  forgetPasswordVerifyCode({}, token) {
    return userApi.forgetPasswordVerifyCode(token)
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error))
  },
  forgetPasswordResetPassword({}, form_data) {
    return userApi.forgetPasswordResetPassword(form_data)
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error))
  },

  sendTwoFactorCode({}) {
    return userApi.sendTwoFactorCode()
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error))
  },
  verifyTwoFactorCode({}, token) {
    return userApi.verifyTwoFactorCode(token)
      .then(() => Promise.resolve())
      .catch(error => Promise.reject(error))
  },
}

// mutations
const mutations = {
  // auth
  [types.LOGIN_SUCCESS]() {
  },

  [types.LOGIN_FAILED](state) {
    state.is_login = false
    state.me = {}
  },
  [types.LOGIN_2FACTOR_SUCCESS](state, response) {
    state.is_login = true
    state.me = response
    router.push({ name: 'dashboard' })
  },
  [types.LOGIN_2FACTOR_FAILED]() {
  },
  [types.LOGOUT](state) {
    state.is_login = false
    state.me = {}
    router.push({ name: 'user_login' })
  },
  [types.REFRESH_SUCCESS](state, response) {
    state.is_login = true
    state.me = response
  },
  [types.REFRESH_FAILED](state) {
    state.is_login = false
    state.me = {}
  },
  [types.REGISTER_SUCCESS](state, response) {
    state.is_login = true
    state.me = response
    router.push('user_signup_followup')
  },
  [types.REGISTER_FAILED](state) {
    state.is_login = false
    state.me = {}
  },
  // load data
  [types.LOAD_ME](state, response) {
    state.me = response
  },
  [types.UPDATE_ME]() {
  },
  // Sign Up Follow Up
  [types.CONFIRM_EMAIL_SUCCESS]() {
  },
  [types.SEND_PHONE_CODE_SUCCESS]() {
  },
  [types.CONFIRM_PHONE_SUCCESS]() {
  },
  [types.ADD_WALLET_ADDRESS_SUCCESS]() {
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
