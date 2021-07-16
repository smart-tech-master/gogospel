export default async ({store, redirect, $axios}) => {
  if (store.state.auth.loggedIn) {
    const {data} = await $axios.get('/v1/api/user')
    store.$auth.setUser(data)
  }
}
