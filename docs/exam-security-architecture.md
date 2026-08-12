# Exam Security Architecture for Anti-Cheating

## Best way to secure the exam

The strongest design is a layered approach combining browser-level monitoring, server-side enforcement, and a controlled exam runtime. A single browser restriction is not enough because users can open another tab, a second device, or use AI tools in the background.

## Recommended security design

### 1. Browser and device lock
- Disable copy/paste, right-click, text selection, and developer tools shortcuts
- Use full-screen mode at the start of the exam
- Force the applicant to keep the exam tab active and prevent switching away
- Block open or hidden browser windows through periodic focus checks
- Use secure session tokens and revoke them on abnormal activity

### 2. App-level anti-cheat controls
- Detect if the user exits full screen, changes tabs, or minimizes the window
- Record tab switch count, mouse inactivity, and keystroke anomalies
- Track if the browser is using an unsupported or emulated environment
- Restrict navigation away from the exam app using route guards and session checks
- Prevent access to external links and new windows

### 3. AI and external app detection
- Not fully possible from browser alone, but it can be reduced with strong controls:
  - Use browser permissions to detect screen-sharing, mic/camera, and access states
  - Require webcam and screen capture for proctored settings
  - Detect if the exam is running in a remote desktop or virtual machine
  - Monitor for common AI-assistant tools via active process detection where OS-level permissions allow it
  - Alert the system for suspicious activity such as repeated copy/paste, unusual answer patterns, or long idle windows

### 4. Server-side validation
- Generate one-time exam tokens per candidate
- Store attempt metadata: start time, end time, tab switches, focus loss events, and answer snapshots
- Log timestamps for every question open, answer save, and submission event
- Use randomized question banks so each candidate receives a personalized mix from previous papers
- Prevent reopening or resuming from another machine unless approved

### 5. Proctoring and behavioral monitoring
- Add webcam and audio checks for identity verification
- Record screen capture only during the exam session where legal and approved
- Flag abrupt behavior such as repeated attention loss, external voice detection, or no movement patterns
- Use a review dashboard for human moderation of flagged sessions

### 6. Strongest practical stack
The most reliable approach is:
- React front end with exam lock controls
- Node or backend API for secure session management
- Database for exam logs, candidate states, and suspicious events
- WebSocket or polling for real-time activity monitoring
- Optional proctoring service for webcam/screen verification

## Important reality check
No client-side solution can guarantee 100% anti-cheat protection against a determined candidate with another screen, phone, or AI tool. The best protection is a combination of:
- secure browser environment
- session-bound exam tokens
- identity verification
- randomized question pools
- behavioral anomaly detection
- human review of flagged cases

## Recommended next step
We should now implement a practical exam-security foundation in the app before writing the assessment engine. This includes:
1. exam session creation
2. inactive-tab detection
3. full-screen enforcement
4. copy-paste lock and route guard
5. event logging backend
6. question-bank mixing from previous-year paper patterns

This should be the development path we follow next.
