import { createClient } from "@supabase/supabase-js"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Use fallback values for development/demo purposes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-key"

// Check if we're in demo mode
const isDemoMode = supabaseUrl === "https://demo.supabase.co" || supabaseAnonKey === "demo-key"

// Default admin credentials
const DEFAULT_ADMIN = {
  email: "luizdonnod@gmail.com",
  password: "Luismanuel@1995",
  name: "Administrador LUMANET",
}

console.log("🔧 Supabase Configuration:", {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  isDemoMode,
  keyLength: supabaseAnonKey.length,
})

// Only create client if we have valid credentials or we're in demo mode
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  // If no real credentials, return a mock client for demo purposes
  if (isDemoMode) {
    return createMockSupabaseClient()
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

export const supabase = getSupabaseClient()

// Mock Supabase client for demo purposes
function createMockSupabaseClient() {
  const mockUser = {
    id: "admin-user-123",
    email: DEFAULT_ADMIN.email,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_metadata: {
      name: DEFAULT_ADMIN.name,
    },
  }

  const mockSession = {
    user: mockUser,
    access_token: "mock-token",
    refresh_token: "mock-refresh-token",
    expires_in: 3600,
    expires_at: Date.now() + 3600000,
    token_type: "bearer",
  }

  // Initialize default admin in localStorage
  if (isBrowser) {
    const existingAdmin = localStorage.getItem("lumanet_admin")
    if (!existingAdmin) {
      localStorage.setItem("lumanet_admin", JSON.stringify(DEFAULT_ADMIN))
    }
  }

  return {
    auth: {
      getSession: async () => {
        // Check if admin is logged in
        if (isBrowser) {
          const loggedIn = localStorage.getItem("lumanet_logged_in")
          if (loggedIn === "true") {
            return Promise.resolve({
              data: { session: mockSession },
              error: null,
            })
          }
        }
        return Promise.resolve({
          data: { session: null },
          error: null,
        })
      },
      onAuthStateChange: (callback: any) => {
        // Check initial state
        if (isBrowser) {
          const loggedIn = localStorage.getItem("lumanet_logged_in")
          setTimeout(() => {
            if (loggedIn === "true") {
              callback("SIGNED_IN", mockSession)
            } else {
              callback("SIGNED_OUT", null)
            }
          }, 100)
        }

        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        }
      },
      signInWithPassword: async ({ email, password }: any) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Check against default admin credentials
        if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
          if (isBrowser) {
            localStorage.setItem("lumanet_logged_in", "true")
            localStorage.setItem("lumanet_current_user", JSON.stringify(mockUser))
          }
          return Promise.resolve({
            data: {
              user: mockUser,
              session: mockSession,
            },
            error: null,
          })
        }

        // Check against any registered users in localStorage
        if (isBrowser) {
          const registeredUsers = JSON.parse(localStorage.getItem("lumanet_users") || "[]")
          const user = registeredUsers.find((u: any) => u.email === email && u.password === password)
          if (user) {
            const userSession = {
              ...mockSession,
              user: { ...mockUser, email: user.email, id: user.id },
            }
            localStorage.setItem("lumanet_logged_in", "true")
            localStorage.setItem("lumanet_current_user", JSON.stringify(userSession.user))
            return Promise.resolve({
              data: {
                user: userSession.user,
                session: userSession,
              },
              error: null,
            })
          }
        }

        return Promise.resolve({
          data: { user: null, session: null },
          error: { message: "Credenciais inválidas" },
        })
      },
      signUp: async ({ email, password }: any) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (!email || !password) {
          return Promise.resolve({
            data: { user: null, session: null },
            error: { message: "Email e senha são obrigatórios" },
          })
        }

        if (password.length < 6) {
          return Promise.resolve({
            data: { user: null, session: null },
            error: { message: "A senha deve ter pelo menos 6 caracteres" },
          })
        }

        // Check if user already exists
        if (isBrowser) {
          const registeredUsers = JSON.parse(localStorage.getItem("lumanet_users") || "[]")
          const existingUser = registeredUsers.find((u: any) => u.email === email)

          if (existingUser || email === DEFAULT_ADMIN.email) {
            return Promise.resolve({
              data: { user: null, session: null },
              error: { message: "Este email já está cadastrado" },
            })
          }

          // Create new user
          const newUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            email,
            password,
            created_at: new Date().toISOString(),
          }

          registeredUsers.push(newUser)
          localStorage.setItem("lumanet_users", JSON.stringify(registeredUsers))

          // Auto login after signup
          const userMock = { ...mockUser, email, id: newUser.id }
          const userSession = { ...mockSession, user: userMock }

          localStorage.setItem("lumanet_logged_in", "true")
          localStorage.setItem("lumanet_current_user", JSON.stringify(userMock))

          return Promise.resolve({
            data: {
              user: userMock,
              session: userSession,
            },
            error: null,
          })
        }

        return Promise.resolve({
          data: { user: null, session: null },
          error: { message: "Erro ao criar conta" },
        })
      },
      signOut: async () => {
        await new Promise((resolve) => setTimeout(resolve, 200))
        if (isBrowser) {
          localStorage.removeItem("lumanet_logged_in")
          localStorage.removeItem("lumanet_current_user")
        }
        return Promise.resolve({ error: null })
      },
    },
    from: (table: string) => ({
      select: (columns = "*") => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: any) => ({
            then: (resolve: any) => {
              setTimeout(() => resolve({ data: [], error: null }), 100)
              return Promise.resolve({ data: [], error: null })
            },
          }),
          then: (resolve: any) => {
            setTimeout(() => resolve({ data: [], error: null }), 100)
            return Promise.resolve({ data: [], error: null })
          },
        }),
        then: (resolve: any) => {
          setTimeout(() => resolve({ data: [], error: null }), 100)
          return Promise.resolve({ data: [], error: null })
        },
      }),
      upsert: (data: any) => ({
        then: (resolve: any) => {
          setTimeout(() => resolve({ data: null, error: null }), 100)
          return Promise.resolve({ data: null, error: null })
        },
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: (resolve: any) => {
            setTimeout(() => resolve({ data: null, error: null }), 100)
            return Promise.resolve({ data: null, error: null })
          },
        }),
      }),
    }),
  }
}

// Export demo mode status and default admin
export { isDemoMode, DEFAULT_ADMIN }
