# WebRTC Telephony Implementation Plan

## Objective
Observe the working control UI, analyze how WebRTC/SIP.js/Asterisk integration works, and implement complete telephony functionality in the new modern UI to achieve production readiness.

## Background Context

### Current State of New UI
From previous codebase exploration, the new UI (`/home/k_nurf/Helplinev2/finalui/`) has:

**✅ Implemented:**
- SIP.js 0.21.2 integration
- Incoming call handling
- WebRTC audio streams via getUserMedia()
- AMI WebSocket for real-time monitoring (port 8384)
- SIP WebSocket connection (port 8089)
- Call history and recording playback
- Wallboard with live channel monitoring
- User extension management

**❌ Missing/Incomplete:**
- Outgoing call initiation (no INVITE sending)
- Call transfer/consultation
- Hold/resume functionality
- DTMF sending
- Presence/queue status control
- Agent queue join/pause mechanisms
- Call recording controls
- Conference/bridge management
- Proper WebRTC configuration (STUN/TURN)
- Security: Hardcoded SIP credentials

**Key Files:**
- `/home/k_nurf/Helplinev2/finalui/src/components/calls/SipAgentView.vue` - SIP agent component
- `/home/k_nurf/Helplinev2/finalui/src/pages/Wallboard.vue` - Real-time monitoring
- `/home/k_nurf/Helplinev2/finalui/src/composables/useWebSocketConnection.js` - AMI WebSocket
- `/home/k_nurf/Helplinev2/finalui/src/stores/calls.js` - Call data store

### Control System
- URL: https://demo-openchs.bitz-itc.com/helpline/
- Login: test / p@ssw0rd
- This is the working production system we'll use as reference

## Implementation Plan

### Phase 1: Analyze Control UI (Research Phase)
**Goal:** Understand how the working system implements WebRTC and telephony features

**Tasks:**
1. Use Chrome DevTools (headless) to observe control UI:
   - Login and capture session flow
   - Monitor Network tab for WebSocket connections (8089, 8384)
   - Track agent queue join process
   - Observe outgoing call initiation
   - Capture call transfer/hold operations
   - Record DTMF sending mechanism
   - Analyze JavaScript console for SIP.js events
   - Export HAR file of network activity

2. Document findings:
   - SIP.js configuration differences
   - WebRTC session parameters
   - STUN/TURN server configuration
   - Queue management API calls
   - Authentication and credential handling
   - WebSocket message formats

### Phase 2: Gap Analysis & Design
**Goal:** Compare control UI with new UI to create implementation roadmap

**Tasks:**
1. Create comparison matrix of features
2. Identify missing API endpoints
3. Map UI interaction flows
4. Design component architecture for missing features
5. Plan configuration management (environment variables vs hardcoded)

### Phase 3: Core WebRTC Implementation
**Goal:** Fix and enhance WebRTC setup in new UI

**Files to Modify:**
- `finalui/src/components/calls/SipAgentView.vue`

**Changes:**
1. **Outgoing Calls:**
   - Add `makeCall(phoneNumber)` function
   - Implement SIP INVITE with proper SDP
   - Create UI for dialer/number input
   - Handle early media and call progress states

2. **WebRTC Configuration:**
   - Add STUN/TURN server configuration
   - Implement ICE candidate handling
   - Configure codec preferences
   - Add network quality monitoring

3. **Security:**
   - Move hardcoded SIP password to environment variable
   - Use secure credential storage
   - Add .env configuration file

4. **Session Management:**
   - Implement hold/resume (SIP re-INVITE)
   - Add attended/blind transfer
   - Handle multiple concurrent sessions
   - Add session cleanup on errors

5. **DTMF:**
   - Add `sendDTMF(digit)` function
   - Implement RFC 4733 (RTP payload for DTMF)
   - Create numeric keypad UI

### Phase 4: Queue Management Integration
**Goal:** Implement agent queue join/pause/unpause functionality

**Files to Modify:**
- `finalui/src/components/calls/SipAgentView.vue`
- Possibly new component: `finalui/src/components/calls/QueueControl.vue`

**Changes:**
1. Add queue status API integration
2. Implement join/pause/unpause actions
3. Add visual queue status indicator
4. Sync queue state with Asterisk AMI events

### Phase 5: Call Controls & Features
**Goal:** Add missing call control features

**Files to Modify:**
- `finalui/src/components/calls/SipAgentView.vue`

**Changes:**
1. **Transfer Controls:**
   - Blind transfer UI and logic
   - Attended transfer (consult then complete)
   - Transfer status tracking

2. **Recording Controls:**
   - Start/stop recording API integration
   - Recording indicator in UI
   - Playback after call completion

3. **Conference:**
   - Multi-party bridge creation
   - Conference management UI
   - Participant list display

### Phase 6: Configuration & Environment Setup
**Goal:** Proper configuration management

**Files to Create/Modify:**
- `finalui/.env.example`
- `finalui/.env`
- `finalui/src/config/sip.js`
- `finalui/vite.config.js`

**Changes:**
1. Create configuration file structure:
   ```
   SIP_SERVER_URL=wss://demo-openchs.bitz-itc.com:8089/ws
   AMI_SERVER_URL=wss://demo-openchs.bitz-itc.com:8384/ami/sync
   STUN_SERVER=stun:stun.l.google.com:19302
   TURN_SERVER=
   SIP_PASSWORD=
   ```

2. Update vite.config.js to load environment variables
3. Refactor SipAgentView to use config instead of hardcoded values

### Phase 7: Testing & Validation
**Goal:** Ensure all features work end-to-end

**Test Scenarios:**
1. Agent login and queue join
2. Receive incoming call
3. Place outgoing call
4. Transfer call (blind and attended)
5. Hold/resume call
6. Send DTMF tones
7. Conference call creation
8. Call recording start/stop
9. WebRTC reconnection on network issues
10. Multiple simultaneous calls

**Verification:**
- Use Chrome DevTools to verify WebSocket connections
- Check console for SIP.js errors
- Monitor network quality and audio stream stats
- Test with real Asterisk server
- Verify call recordings are saved properly

## Critical Files to Modify

| File Path | Purpose | Changes |
|-----------|---------|---------|
| `finalui/src/components/calls/SipAgentView.vue` | Main SIP agent | Add outgoing calls, transfers, hold, DTMF, queue controls |
| `finalui/.env` | Environment config | Add SIP/WebRTC server URLs and credentials |
| `finalui/src/config/sip.js` | SIP configuration | Create centralized config module |
| `finalui/vite.config.js` | Build config | Load environment variables |

## Dependencies to Review
- sip.js@0.21.2 (already installed - verify it's latest stable)
- Check if additional WebRTC libraries needed
- Verify Asterisk modules: chan_sip/chan_pjsip, res_http_websocket, res_ami

## Risks & Considerations
1. **Browser Compatibility:** WebRTC requires secure context (HTTPS/WSS)
2. **NAT Traversal:** May need TURN server for certain network environments
3. **Asterisk Configuration:** Backend may need dialplan/queue adjustments
4. **Credential Security:** Must not commit SIP passwords to git
5. **Audio Device Permissions:** Users must grant microphone access

## Success Criteria
- ✅ Agent can join/pause queue
- ✅ Agent can receive incoming calls
- ✅ Agent can place outgoing calls
- ✅ Agent can transfer calls (blind & attended)
- ✅ Agent can hold/resume calls
- ✅ Agent can send DTMF tones
- ✅ All credentials in environment variables
- ✅ WebRTC works across different networks
- ✅ No console errors during normal operation
- ✅ Matches functionality of control UI

## Implementation Status

### Completed
- [ ] Phase 1: Control UI Analysis
- [ ] Phase 2: Gap Analysis & Design
- [ ] Phase 3: Core WebRTC Implementation
- [ ] Phase 4: Queue Management Integration
- [ ] Phase 5: Call Controls & Features
- [ ] Phase 6: Configuration & Environment Setup
- [ ] Phase 7: Testing & Validation

### Current Progress
**Phase:** 1 - Control UI Analysis
**Status:** In Progress
**Next Steps:** Login to control UI and monitor WebSocket connections

## Notes & Findings

### Control UI Observations
_This section will be populated as we analyze the working control UI_

### Implementation Decisions
_Document key architectural and implementation decisions here_

### Issues & Blockers
_Track any problems encountered during implementation_
