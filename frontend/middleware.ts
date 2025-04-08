import { type NextRequest, NextResponse } from "next/server";

// Define protected routes and their required roles
const protectedRoutes = [
  { path: "/admin", roles: ["admin"] },
  { path: "/restaurant", roles: ["restaurant"] },
  { path: "/livreur", roles: ["livreur"] },
  { path: "/client", roles: ["client"] },
  { path: "/profile", roles: ["admin", "restaurant", "livreur", "client"] },
];

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  console.log("Middleware processing path:", pathname);

  // Skip middleware for static assets, API routes, etc.
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes("/favicon.ico")
  ) {
    console.log("Static asset or API route, allowing access");
    return NextResponse.next();
  }

  // Get the auth cookie (using auth-storage from Zustand persist)
  const authCookie = request.cookies.get("auth-storage")?.value;
  let isAuthenticated = false;
  let userRole = null;

  // Try to parse the auth cookie if it exists
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie);
      isAuthenticated = authData.state?.isAuthenticated || false;
      userRole = authData.state?.user?.role;
      console.log("Auth data:", { isAuthenticated, role: userRole });
    } catch (error) {
      console.error("Error processing auth cookie:", error);
      isAuthenticated = false;
    }
  }

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // Check if the current path is a protected route
  const matchedProtectedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  );

  // CASE 1: User is NOT authenticated
  if (!isAuthenticated) {
    // Allow access to public routes for unauthenticated users
    if (isPublicRoute) {
      console.log("Public route, allowing unauthenticated access");
      return NextResponse.next();
    }

    // Redirect unauthenticated users to login if they try to access protected routes
    console.log(
      "Unauthenticated user trying to access protected route, redirecting to login"
    );
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // CASE 2: User IS authenticated
  // If user is authenticated and tries to access a public route like login,
  // redirect them to their dashboard
  if (isPublicRoute && pathname !== "/") {
    console.log(
      "Authenticated user trying to access public route, redirecting to dashboard"
    );
    return redirectToDashboard(request, userRole);
  }

  // If trying to access a protected route
  if (matchedProtectedRoute) {
    // Check if user's role allows access to this route
    if (!matchedProtectedRoute.roles.includes(userRole)) {
      console.log(
        "User role not allowed for this route, redirecting to appropriate dashboard"
      );
      return redirectToDashboard(request, userRole);
    } else {
      // User has the correct role for this route
      console.log("Access granted to protected route");
      return NextResponse.next();
    }
  }

  // Any other route that's neither public nor protected
  console.log("Route not explicitly defined, allowing access");
  return NextResponse.next();
}

// Helper function to redirect to the appropriate dashboard
function redirectToDashboard(request: NextRequest, role: string) {
  const url = request.nextUrl.clone();
  switch (role) {
    case "admin":
      url.pathname = "/admin";
      break;
    case "restaurant":
      url.pathname = "/restaurant";
      break;
    case "livreur":
      url.pathname = "/livreur";
      break;
    case "client":
      url.pathname = "/client";
      break;
    default:
      url.pathname = "/";
  }
  return NextResponse.redirect(url);
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Match all paths except static files, api routes, etc.
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
