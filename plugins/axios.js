export default function ({$axios, $auth, redirect}) {
  $axios.onError((error) => {
    if (error.response.status === 401) {
      if ($auth.loggedIn) {
        $auth.reset()
        $auth.setUser(null)
        return redirect('/login')
      }
      return false
    }
  })
}
