# Changelog

All notable changes to react-web3-dapp-ai project will be documented in this file.

## [v1.4.2] - 2025-11-28

### Enhanced

#### 📊 Project Display Formatting Improvements
- **Progress Display Precision**
  - Changed progress display from whole numbers to 3 decimal places
  - Example: "67%" → "67.250%" for more precise tracking
  - Implemented `formatProgress()` helper function for consistent formatting

- **Smart Amount Formatting**
  - Added intelligent amount display with M/K suffixes for better readability
  - Large amounts (≥1M): Display as "$2.50M" instead of "$2,500,000"
  - Medium amounts (≥1K): Display as "$500.5K" instead of "$500,500"  
  - Small amounts (<1K): Display as "$250" (whole numbers only)
  - Implemented `formatAmountInMillions()` helper function

- **Mobile Screen Optimization**
  - Shorter, cleaner display reduces visual clutter in project cards
  - Better utilization of limited mobile screen space
  - Professional financial data presentation consistent with industry standards
  - Maintained readability while improving information density

### Fixed

#### 🐛 Project Card Display Issues
- **Card Size Optimization**
  - Increased card padding from `p-6 lg:p-8` to `p-8 lg:p-10` for more content space
  - Added minimum card height (`min-h-[400px]`) for consistent sizing
  - Changed grid layout from 3-column to 2-column (`lg:grid-cols-2`) for better space utilization

- **Amount Display Fix** 
  - Enhanced stats grid spacing from `gap-3 lg:gap-4` to `gap-4 lg:gap-6`
  - Increased stats padding from `p-3 lg:p-4` to `p-4 lg:p-5`
  - Upgraded text sizing from `text-sm lg:text-lg` to `text-base lg:text-xl`
  - Added `break-words` class to prevent amount text overflow

- **Visual Improvements**
  - Increased gap spacing between cards for better visual separation
  - Improved text readability with larger font sizes
  - Better card proportions for professional appearance

## [v1.4.1] - 2025-11-28

### Fixed

#### 🐛 Mobile Navigation Menu Display Issues
- **Z-Index Layering Fix**
  - Fixed mobile navigation menu visibility issue caused by z-index conflicts
  - Added `relative z-50` to mobile menu container to ensure proper layering above overlay
  - Enhanced visual separation with `shadow-lg` for better menu distinction

### Enhanced

#### 🎨 Mobile Navigation Glassmorphism Design
- **Semi-Transparent Menu Background**
  - Changed mobile menu from opaque white (`bg-white`) to semi-transparent (`bg-white/80`)
  - Added backdrop blur effect (`backdrop-blur-md`) for modern glassmorphism appearance
  - Updated menu border to semi-transparent (`border-gray-200/50`)

- **Improved Page Visibility**
  - Reduced overlay opacity from `bg-black/25` to `bg-black/10` for better page content visibility
  - Enhanced text contrast (`text-gray-700`) for optimal readability on transparent background
  - Updated hover states to semi-transparent white (`hover:bg-white/60`)

- **Modern iOS/macOS Style**
  - Implemented backdrop filter blur for contemporary design aesthetic
  - Maintained accessibility while allowing page content to show through menu
  - Smooth transitions between menu states with consistent visual feedback

## [v1.4.0] - 2025-11-28

### Added

#### 📱 Comprehensive Mobile Responsive Design
- **Mobile-First Navigation System**
  - Implemented collapsible hamburger menu for mobile devices
  - Smooth animation transitions with background overlay
  - Touch-friendly menu interactions and automatic menu close on navigation
  - Responsive header height and logo size adjustments
  - Mobile Connect Button positioning optimization

#### 📐 Responsive Layout System
- **Universal Responsive Patterns**
  - Consistent responsive padding: px-4 (mobile) → lg:px-6 (desktop)
  - Adaptive text sizing: base (mobile) → lg:xl (desktop)
  - Responsive spacing system: gap-3 lg:gap-4, mb-3 lg:mb-4
  - Touch-optimized button sizes and spacing

### Enhanced

#### 🪙 Mint Page Mobile Optimization
- **Responsive Grid Layouts**
  - Mobile: single column layout for optimal viewing
  - Tablet: 2-column grid (sm:grid-cols-2) for balance cards
  - Desktop: 3-column layout (lg:grid-cols-3) for full feature display
  - Smart card spanning: third balance card spans 2 columns on tablet (sm:col-span-2 lg:col-span-1)

- **Mobile-Optimized Components**
  - Reduced padding: p-4 (mobile) → lg:p-6 (desktop) for cards
  - Responsive text sizes: text-lg (mobile) → lg:text-xl (desktop) for inputs
  - Adaptive container spacing: py-8 px-4 (mobile) → lg:py-12 (desktop)
  - Mobile-friendly mint form controls and button layouts

#### 🚀 LaunchPad Page Mobile Enhancement
- **Responsive Project Grid**
  - Mobile: single column for focused project viewing
  - Tablet: 2-column layout (md:grid-cols-2) for better utilization
  - Desktop: 3-column layout (xl:grid-cols-3) for comprehensive overview
  - Optimized card spacing: gap-4 (mobile) → lg:gap-8 (desktop)

- **Mobile Action Bar**
  - Vertical stacking on mobile (flex-col sm:flex-row)
  - Full-width buttons on mobile for better touch accessibility
  - Centered balance display with responsive sizing
  - Improved button text visibility (removed hidden sm:inline)

- **Enhanced Project Cards**
  - Responsive padding: p-6 (mobile) → lg:p-8 (desktop)
  - Improved header layout with proper text truncation
  - Flexible status badge positioning (flex-shrink-0 ml-2)
  - Adaptive stats grid: gap-3 (mobile) → lg:gap-4 (desktop)
  - Responsive text sizes in project statistics

- **Mobile-Optimized Modal**
  - Responsive padding: p-4 (mobile) → lg:p-8 (desktop)
  - Vertical scroll support: max-h-[90vh] overflow-y-auto
  - Adaptive text sizes: text-2xl (mobile) → lg:text-3xl (desktop)
  - Mobile-friendly investment form controls
  - Responsive timeline section spacing

### Fixed

#### 🐛 Mobile User Experience Issues
- **Touch Target Optimization**
  - Increased button sizes for better mobile interaction
  - Improved spacing between interactive elements
  - Enhanced hover states for better feedback

- **Layout Overflow Prevention**
  - Fixed horizontal scroll issues on mobile devices
  - Proper text truncation for long project names
  - Responsive container max-widths

- **Visual Hierarchy Improvements**
  - Better mobile typography scale
  - Consistent spacing patterns across all screen sizes
  - Improved readability on small screens

### Technical

#### 🛠️ Responsive Design Implementation
- **Tailwind CSS Responsive System**
  - Consistent breakpoint usage: sm (640px), md (768px), lg (1024px), xl (1280px)
  - Mobile-first approach with progressive enhancement
  - Responsive utility classes for spacing, typography, and layout

- **Component Architecture**
  - Responsive state management for mobile menu
  - Conditional rendering for different screen sizes
  - Optimized component re-renders for mobile performance

## [v1.3.0] - 2025-11-28

### Added

#### 🪙 Dedicated Token Mint Page
- **New Mint Page (/mint)**
  - Created dedicated page for minting test tokens (USDC, TKA, TKB)
  - Modern card-based design with individual sections for each token
  - Real-time balance display and transaction status updates
  - Interactive mint controls with MAX button functionality
  - Support for minting up to 1,000 tokens per transaction
  - Success notifications with Etherscan transaction links
  - Responsive design optimized for mobile and desktop

#### 🚀 LaunchPad Page Redesign
- **Complete UI/UX Overhaul**
  - Moved mint functionality to dedicated mint page for better UX separation
  - Modern gradient background themes (indigo-purple-pink)
  - Glassmorphism design with backdrop blur effects
  - Enhanced project cards with improved visual hierarchy
  - Animated progress bars and hover effects
  - Better project stats layout with colored category sections
  - Improved modal design for project details

#### 🎨 Visual Enhancements
- **Enhanced Design System**
  - Consistent gradient themes across components
  - Improved color palette with better contrast
  - Modern rounded corners and shadow effects
  - Enhanced typography with gradient text effects
  - Smooth animations and transitions
  - Better spacing and layout consistency

### Changed

#### 📋 Navigation Updates
- **Header Navigation**
  - Added "Mint" link to main navigation menu
  - Improved navigation order for better user flow
  - Enhanced link styling for better visual hierarchy

#### 🔧 LaunchPad Improvements
- **Functionality Separation**
  - Removed mint modals from launchpad page
  - Simplified action bar with "Mint Tokens" and "Create Project" buttons
  - Cleaner balance display showing only USDC balance
  - Better focus on core launchpad functionality (discovering and investing in projects)

## [v1.2.0] - 2025-01-27

### Fixed

#### 🐛 ApproveButton Token Symbol Display Issue
- **Fixed approve button display showing incorrect token name**
  - Issue: Farm page approve button always displayed "approve usdc" regardless of actual token
  - Root cause: ApproveButton component used hardcoded "USDC" token name
  - Solution: Added `tokenSymbol` prop to ApproveButton component for dynamic token display
  - Updated all ApproveButton usages across application:
    - Farm page: `tokenSymbol="LP"` for LP token approvals
    - Swap page: `tokenSymbol={tokenInData?.symbol}` for dynamic token symbols  
    - Pool page: `tokenSymbol="TKA"` and `tokenSymbol="TKB"` for respective tokens
    - Launchpad page: `tokenSymbol="USDC"` for USDC approvals
  - Users now see correct token names in approval buttons (e.g., "Approve LP", "Approve TKA")

#### 🐛 Farm Page LP Token Balance Issue
- **LP Token Address Configuration Fix**
  - Fixed farm page showing 0 LP balance despite having actual tokens
  - Corrected LP token address from `NEXT_PUBLIC_STAKE_POOL_ADDRESS` to `NEXT_PUBLIC_SWAP_ADDRESS`
  - Aligned with web3-dapp configuration where SWAP contract serves as LP token
  - Users should now see correct LP balances (e.g., 112 tokens) matching web3-dapp display

- **Balance Reading Logic Improvements**
  - Removed mock mode restriction that prevented balance reading from deployed contracts
  - Changed enable condition from `!isMockMode` to checking for valid contract addresses
  - Now reads balances from actual contracts when available, regardless of mock mode status
  - Removed hardcoded mock balance data to use real contract data

#### 🔄 Multi-Page Logic Alignment with web3-dapp
- **Swap Page Token Switching Bug Fix**
  - Fixed token switching where conversion icon switched tokens but not balance displays
  - Added `refetch` functionality to balance reading hooks
  - Balance displays now properly swap when tokens are switched

- **Farm Page Complete Refactor**
  - Replaced custom hooks with direct wagmi hooks (useReadContract, useWriteContract)
  - Added multi-pool support with individual FarmPoolCard components
  - Integrated unified ApproveButton component for consistent approval workflows
  - Added real-time transaction status tracking with Etherscan links
  - Created `/api/farm/stats` endpoint with comprehensive mock data
  - Support for deposit/withdraw/harvest operations across multiple pools
  - Enhanced error handling and loading states with proper mock mode detection

- **Bridge Page Complete Implementation**
  - Transformed from static UI to fully functional cross-chain bridge
  - Added wagmi wallet integration with real-time token balance reading
  - Created `/api/bridge/transfer` endpoint for cross-chain transfer operations
  - Implemented real-time transfer status tracking (queued → inflight → complete)
  - Added comprehensive form validation and error handling
  - Support for source/target chain selection with validation logic
  - Added TransferRecord component with progress visualization
  - Status updates every 3 seconds with progress bars and completion tracking

### Technical Improvements

#### ⚡ Enhanced Contract Integration
- **Consistent wagmi v2 Implementation**
  - Unified use of useReadContract, useWriteContract, and useWaitForTransactionReceipt
  - Proper query enabling conditions based on contract deployment status
  - Enhanced type safety with BigInt support and proper error handling

- **ApproveButton Component Integration**
  - Consistent approval workflows across farm, bridge, and swap pages
  - Automatic allowance checking and approval state management
  - Maximum uint256 approval following DeFi security best practices

- **Mock Mode Enhancements**
  - Intelligent contract deployment detection
  - Fallback mechanisms when contracts are not available
  - Clear user notifications about mock vs. real contract interactions

---

## [v1.1.0] - 2025-01-27

### Added

#### 🚀 Launchpad Multi-Token Mint System
- **TokenA and TokenB Mint Functionality**
  - Added mint buttons for TokenA (TKA) and TokenB (TKB) alongside existing USDC mint
  - Created dedicated mint modals for each token with consistent UI/UX design
  - Added balance display for all three tokens (USDC, TKA, TKB) in action bar
  - Support up to 1,000 tokens per mint transaction for testing purposes
  - Token addresses sourced from configuration files for consistency
  - Distinct visual styling: Orange/red gradients for TKA, Cyan/blue for TKB

- **Enhanced Investment Authorization Flow**
  - Implemented comprehensive approve authorization flow for launchpad investments
  - Added ApproveButton component with automatic allowance checking
  - Updated investment workflow: users must approve USDC before investing
  - Button dynamically displays "Approve USDC" or "Confirm Investment" based on authorization status
  - Enhanced security following DeFi best practices with maximum uint256 approval

#### 💧 Pool Page Complete Refactor
- **Logic Alignment with web3-dapp Reference Implementation**
  - Fixed critical contract address: now uses SWAP contract instead of incorrect STAKE_POOL
  - Replaced dynamic token selection with fixed TKA/TKB pair for AMM consistency
  - Integrated ApproveButton component for dual token approval workflow
  - Added automatic proportional amount calculation based on pool reserves
  - Implemented proper LP token balance reading and removal calculations

- **Enhanced Pool Features**
  - Added mock mode detection for contract deployment status
  - Updated UI to display pool stats (TVL, Reserve A, Reserve B) with gradient cards
  - Added proper reserve reading from SWAP contract `getReserves()` function
  - Implemented proportional liquidity removal calculations
  - Added Max balance buttons for quick input
  - Fixed TypeScript compatibility issues for wagmi v2

#### 🔄 Swap Page Complete Logic Overhaul
- **Advanced Trading Features**
  - Replaced custom hooks with direct wagmi hooks for better control and reliability
  - Integrated ApproveButton component for unified approval flow
  - Added sophisticated slippage tolerance settings (0.1%, 0.5%, 1.0% presets + custom input)
  - Implemented reserves reading and price impact calculation with color-coded warnings
  - Added mock mode detection with automatic fallback calculations

- **Enhanced Trading Experience**
  - Chain quote fetching from `getAmountOut()` with automatic fallback to mock calculations
  - Real-time liquidity display and minimum received amount calculations
  - Price impact warnings for high-impact trades (>2% yellow, >5% red)
  - Max balance button for quick input
  - Success messages with direct Etherscan transaction links
  - Debounced quote fetching (500ms) to reduce API calls

#### 🔧 Technical Infrastructure Improvements
- **Missing API Infrastructure**
  - Created `/api/stake/pools` route to resolve JSON parsing errors
  - Added comprehensive mock pool data with proper TVL, APR, and pool information structure
  - Fixed "Unexpected token '<', '<!DOCTYPE'" error in pool page API calls

- **TypeScript & Build System**
  - Updated tsconfig.json target to ES2020 for BigInt support
  - Fixed all TypeScript type errors across components with proper type annotations
  - Ensured complete wagmi v2 compatibility throughout the application
  - Added proper type safety for React node rendering with conditional rendering patterns

### Changed

#### 📝 Configuration & Architecture Updates
- **Unified Configuration Management**
  - Updated token address resolution to use configuration files consistently
  - Enhanced error handling for missing contract addresses with graceful fallbacks
  - Improved mock mode fallbacks when contracts are not deployed

- **User Experience Enhancements**
  - Standardized button colors and styling across all mint functions
  - Improved loading states and transaction feedback with detailed status messages
  - Enhanced error messages with more descriptive information and user guidance
  - Added comprehensive transaction success notifications with external links

### Fixed

#### 🐛 Critical Bug Resolutions
- **Pool Page Contract Issues**
  - Fixed incorrect contract address resolution (STAKE_POOL → SWAP)
  - Resolved function call mismatches with proper SWAP ABI usage
  - Fixed LP token balance calculations and display formatting

- **Swap Page Logic Errors** 
  - Resolved quote calculation inconsistencies with proper chain/mock fallback
  - Fixed approval flow issues with standardized ApproveButton integration
  - Corrected token switching logic and amount preservation

- **API & Data Flow**
  - Fixed missing `/api/stake/pools` endpoint causing JSON parsing errors
  - Resolved undefined data states with proper loading and error handling
  - Fixed balance display formatting and refresh mechanisms

- **TypeScript & Compilation**
  - Resolved all compilation errors and type mismatches
  - Fixed React node type issues with proper conditional rendering
  - Added proper BigInt support with ES2020 target configuration

#### ⚡ Performance Improvements
- **Optimized Component Rendering**
  - Enhanced component re-renders with proper dependency arrays
  - Added debounced quote fetching to reduce unnecessary API calls
  - Implemented efficient balance and allowance checking with wagmi query optimization

- **Memory & State Management**
  - Optimized state updates with proper cleanup in useEffect hooks
  - Reduced unnecessary re-renders with optimized dependency tracking
  - Improved error boundary handling for better stability

---

## [v1.0.1] - 2025-01-27 (Previous Release)

### 🐛 LaunchPad 核心问题修复

#### 1. USDC 余额显示为 0 的问题
**问题描述:**
- 用户 mint 成功后,USDC 余额始终显示为 0
- `useTokenBalance` hook 无法正确读取余额

**根本原因:**
- `ERC20_ABI` 中缺少 `decimals` 函数定义
- `useTokenBalance` 依赖 `decimals` 来格式化余额,导致读取失败

**修复方案:**
- ✅ 在 `lib/abis/erc20.js` 中添加 `decimals` 函数定义

#### 2. USDC 地址获取错误
**修复方案:**
- ✅ 直接使用环境变量 `process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS`
- ✅ 移除对 `getTokenAddress` 的依赖

#### 3. 显示硬编码模拟数据而非真实链上数据
**修复方案:**
- ✅ 添加 API 调用从 `/api/launchpad/projects` 获取数据
- ✅ 创建 `app/api/launchpad/projects/route.ts` API 路由
- ✅ API 优先从链上读取数据,失败时返回模拟数据

#### 4. 创建项目功能错误  
**修复方案:**
- ✅ 创建独立的创建页面 `/launchpad/create`
- ✅ 使用正确的 `createTokenAndSale` 函数
- ✅ 添加完整的表单字段和参数验证

---

## Technical Details

### Dependencies & Compatibility
- **Wagmi v2**: Full compatibility with latest hooks and patterns
- **Viem**: Enhanced integration for better type safety and BigInt support
- **React 18+**: Optimized for concurrent features and improved performance
- **Next.js**: App router and API routes architecture

### Architecture Improvements
- **Centralized ApproveButton Component**: Consistent approval flows across all DeFi operations
- **Unified Error Handling**: Standardized patterns for transaction errors and network issues
- **Mock Mode System**: Comprehensive fallback mechanisms when contracts are not deployed
- **Type Safety**: Full TypeScript coverage with proper type definitions

### Security Enhancements
- **Approval Workflows**: Proper ERC20 approval patterns before token operations
- **Slippage Protection**: User-configurable slippage tolerance with warnings
- **Price Impact Warnings**: Visual indicators for high-impact trades
- **Input Validation**: Comprehensive validation for all user inputs and transaction parameters

---

## Development Notes

- **Backward Compatibility**: All changes maintain compatibility with existing user data and preferences
- **Mock Mode Availability**: Application remains fully functional even without deployed contracts for testing
- **Enhanced Security**: All DeFi operations follow established security patterns and best practices  
- **Developer Experience**: Comprehensive TypeScript coverage and improved debugging capabilities

## Contributors

- **Implementation**: Claude AI Assistant
- **Project Oversight**: liujp2015 (392303104@qq.com)
- **Architecture Review**: Development Team

---

## Migration Guide

### From v1.0.1 to v1.1.0

1. **Environment Variables**: Ensure all required token addresses are properly configured
2. **Contract Deployment**: Verify SWAP contract is deployed and configured correctly
3. **API Routes**: The new `/api/stake/pools` route is automatically available
4. **UI Changes**: No breaking changes to user interface, all improvements are additive

### Testing Checklist

- [ ] USDC/TKA/TKB minting functionality
- [ ] Pool liquidity addition and removal
- [ ] Token swapping with slippage settings  
- [ ] ApproveButton workflows across all components
- [ ] Mock mode fallbacks when contracts unavailable
- [ ] Responsive design and mobile compatibility
