const translations = {
  en: {
    common: {
      language: "Language",
      english: "English",
      vietnamese: "Vietnamese",

      loading: "Loading...",
      cancel: "Cancel",
      save: "Save",
      close: "Close",
      search: "Search",
      reset: "Reset",
      logout: "Log out",

      all: "All",
      action: "Action",
      status: "Status",
      priority: "Priority",
      category: "Category",

      noData: "No data available",
    },

    auth: {
      brandName: "IT Helpdesk",
      brandSubtitle: "Asset Management",

      internalSystem: "Internal system",

      heroTitle:
        "Support requests and company assets, managed in one place.",

      heroDescription:
        "Submit technical issues, follow their progress and keep track of assigned equipment.",

      organization:
        "Company IT Operations",

      signInTitle:
        "Sign in",

      signInDescription:
        "Use your company account to continue.",

      emailLabel:
        "Email address",

      emailPlaceholder:
        "name@company.com",

      passwordLabel:
        "Password",

      passwordPlaceholder:
        "Enter your password",

      showPassword:
        "Show",

      hidePassword:
        "Hide",

      signInButton:
        "Sign in",

      signingIn:
        "Signing in...",

      supportHint:
        "Contact IT Support if you cannot access your account.",

      errors: {
        invalidCredentials:
          "Invalid email or password.",

        inactiveAccount:
          "Your account is inactive. Please contact IT Support.",

        network:
          "Unable to connect to the server. Please try again.",

        generic:
          "Unable to sign in. Please check your credentials.",
      },
    },

    navigation: {
      workspace:
        "Workspace",

      internalPortal:
        "Internal IT Portal",

      dashboard:
        "Dashboard",

      tickets:
        "Tickets",

      myTickets:
        "My tickets",

      assets:
        "Assets",

      myAssets:
        "My assets",

      users:
        "Users",

      supportQueue:
        "Support queue",

      settings:
        "Settings",
    },

    roles: {
      employee:
        "Employee",

      itSupport:
        "IT Support",

      admin:
        "Administrator",
    },

    dashboard: {
      admin: {
        title:
          "System overview",

        description:
          "Current helpdesk and asset management activity.",

        totalTickets:
          "Total tickets",

        openTickets:
          "Open tickets",

        assets:
          "Assets",

        assignedAssets:
          "Assigned assets",

        activeUsers:
          "Active users",

        averageRating:
          "Average rating",

        ticketStatus:
          "Ticket status",

        ticketStatusDescription:
          "Current ticket distribution.",

        assetStatus:
          "Asset status",

        assetStatusDescription:
          "Current equipment availability.",

        open:
          "Open",

        assigned:
          "Assigned",

        inProgress:
          "In progress",

        waitingForUser:
          "Waiting for user",

        resolved:
          "Resolved",

        closed:
          "Closed",

        available:
          "Available",

        maintenance:
          "Maintenance",

        retired:
          "Retired",

        loadError:
          "Unable to load dashboard.",
      },

      employee: {
        title:
          "My workspace",

        description:
          "An overview of your support requests and assigned equipment.",

        totalTickets:
          "Total tickets",

        activeTickets:
          "Active tickets",

        closedTickets:
          "Closed tickets",

        assignedAssets:
          "Assigned assets",

        recentTickets:
          "Recent tickets",

        recentTicketsDescription:
          "Your latest support requests.",

        noTickets:
          "No tickets yet",

        noTicketsDescription:
          "Your submitted support requests will appear here.",
      },

      support: {
        title:
          "Support workspace",

        description:
          "View and manage tickets currently assigned to you.",

        assigned:
          "Assigned",

        inProgress:
          "In progress",

        waiting:
          "Waiting",

        resolved:
          "Resolved",

        currentQueue:
          "Current queue",

        currentQueueDescription:
          "Tickets currently assigned to you.",

        clearQueue:
          "Queue is clear",

        clearQueueDescription:
          "There are no active tickets assigned to you.",
      },
    },

    tickets: {
      title:
        "Tickets",

      employeeTitle:
        "My tickets",

      supportTitle:
        "Support queue",

      adminTitle:
        "Ticket management",

      description:
        "Manage and track IT support requests.",

      employeeDescription:
        "View and track your submitted support requests.",

      supportDescription:
        "View and manage tickets assigned to you.",

      adminDescription:
        "Monitor and manage support requests across the organization.",

      createTicket:
        "Create ticket",

      searchPlaceholder:
        "Search ticket code, title or description...",

      ticketCode:
        "Ticket code",

      titleColumn:
        "Title",

      category:
        "Category",

      priority:
        "Priority",

      status:
        "Status",

      createdAt:
        "Created",

      assignedTo:
        "Assigned to",

      total:
        "tickets",

      noTickets:
        "No tickets found",

      noTicketsDescription:
        "There are no tickets matching the current filters.",

      loadError:
        "Unable to load tickets.",

      filters: {
        status:
          "Status",

        priority:
          "Priority",

        allStatuses:
          "All statuses",

        allPriorities:
          "All priorities",
      },

      statuses: {
        OPEN:
          "Open",

        ASSIGNED:
          "Assigned",

        IN_PROGRESS:
          "In progress",

        WAITING_FOR_USER:
          "Waiting for user",

        RESOLVED:
          "Resolved",

        CLOSED:
          "Closed",
      },

      priorities: {
        LOW:
          "Low",

        MEDIUM:
          "Medium",

        HIGH:
          "High",

        URGENT:
          "Urgent",
      },

      create: {
        title:
          "Create ticket",

        description:
          "Submit a new IT support request.",

        ticketTitle:
          "Title",

        titlePlaceholder:
          "Describe the issue briefly",

        category:
          "Category",

        priority:
          "Priority",

        descriptionLabel:
          "Description",

        descriptionPlaceholder:
          "Provide details about the issue...",

        createButton:
          "Create ticket",

        creating:
          "Creating...",

        success:
          "Ticket created successfully.",

        error:
          "Unable to create ticket.",
      },

      detail: {
        title:
          "Ticket detail",

        overview:
          "Overview",

        description:
          "Description",

        createdBy:
          "Created by",

        assignedTo:
          "Assigned to",

        category:
          "Category",

        priority:
          "Priority",

        status:
          "Status",

        createdAt:
          "Created at",

        updatedAt:
          "Updated at",

        linkedAsset:
          "Linked asset",

        noAsset:
          "No asset linked",

        comments:
          "Comments",

        addComment:
          "Add comment",

        commentPlaceholder:
          "Write a comment...",

        sendComment:
          "Send comment",

        sendingComment:
          "Sending...",

        history:
          "Status history",

        rating:
          "Rating",

        noRating:
          "No rating yet",

        back:
          "Back to tickets",

        loadError:
          "Unable to load ticket detail.",
      },

      assign: {
        title:
          "Assign ticket",

        selectSupport:
          "Select IT Support",

        assignButton:
          "Assign",

        assigning:
          "Assigning...",

        success:
          "Ticket assigned successfully.",

        error:
          "Unable to assign ticket.",
      },

      updateStatus: {
        title:
          "Update status",

        selectStatus:
          "Select status",

        note:
          "Resolution note",

        notePlaceholder:
          "Add a note about this status update...",

        updateButton:
          "Update status",

        updating:
          "Updating...",

        success:
          "Ticket status updated successfully.",

        error:
          "Unable to update ticket status.",
      },

      statusActions: {
        start:
          "Start working",

        waiting:
          "Wait for user",

        resume:
          "Resume work",

        resolve:
          "Resolve ticket",

        close:
          "Confirm and close",

        confirmTitle:
          "Confirm resolution",
      },

      rating: {
        title:
          "Rate support",

        selectRating:
          "Select rating",

        comment:
          "Comment",

        commentPlaceholder:
          "Share your support experience...",

        submit:
          "Submit rating",

        submitting:
          "Submitting...",

        success:
          "Rating submitted successfully.",

        error:
          "Unable to submit rating.",
      },
    },

    users: {
      title:
        "Users",

      description:
        "Manage system users and account access.",

      addUser:
        "Add user",

      searchPlaceholder:
        "Search by name, email, role or department...",

      usersCount:
        "users",

      fullName:
        "Full name",

      email:
        "Email",

      role:
        "Role",

      department:
        "Department",

      departmentId:
        "Department ID",

      status:
        "Status",

      action:
        "Action",

      active:
        "Active",

      inactive:
        "Inactive",

      activate:
        "Activate",

      deactivate:
        "Deactivate",

      initialPassword:
        "Initial password",

      optional:
        "Optional",

      createTitle:
        "Add new user",

      createDescription:
        "Create a new account and assign its system role.",

      createUser:
        "Create user",

      creating:
        "Creating...",

      createSuccess:
        "User created successfully.",

      createError:
        "Unable to create user.",

      loadError:
        "Unable to load users.",

      statusSuccess:
        "User status updated successfully.",

      statusError:
        "Unable to update user status.",

      noUsers:
        "No users found",

      noUsersDescription:
        "There are no users matching the current filters.",

      filters: {
        allRoles:
          "All roles",

        allStatuses:
          "All statuses",
      },

      noDepartment:
        "No department",

      you:
        "You",

      updating:
        "Updating...",

      cannotDeactivateSelf:
        "You cannot deactivate your own account",
    },

    assets: {
      title:
        "Assets",

      description:
        "View and manage company IT equipment.",

      addAsset:
        "Add asset",

      searchPlaceholder:
        "Search assets...",

      assetsCount:
        "assets",

      assetCode:
        "Asset code",

      assetName:
        "Asset name",

      categoryId:
        "Category ID",

      category:
        "Category",

      locationId:
        "Location ID",

      location:
        "Location",

      brand:
        "Brand",

      model:
        "Model",

      serialNumber:
        "Serial number",

      purchaseDate:
        "Purchase date",

      warrantyExpiration:
        "Warranty expiration",

      notes:
        "Notes",

      status:
        "Status",

      assignedTo:
        "Assigned to",

      filters: {
        allStatuses:
          "All statuses",

        allCategories:
          "All categories",

        allLocations:
          "All locations",
      },

      createTitle:
        "Add new asset",

      createDescription:
        "Register new IT equipment in the asset inventory.",

      createAsset:
        "Create asset",

      creating:
        "Creating...",

      createSuccess:
        "Asset created successfully.",

      createError:
        "Unable to create asset.",

      loadError:
        "Unable to load assets.",

      noAssets:
        "No assets found",

      noAssetsDescription:
        "No assets match the current search.",

      statuses: {
        AVAILABLE:
          "Available",

        ASSIGNED:
          "Assigned",

        MAINTENANCE:
          "Maintenance",

        RETIRED:
          "Retired",
      },

      detail: {
        title:
          "Asset detail",

        information:
          "Asset information",

        assignmentHistory:
          "Assignment history",

        noHistory:
          "No assignment history",

        back:
          "Back to assets",

        loadError:
          "Unable to load asset detail.",

        assignedDate:
          "Assigned",

        returnedDate:
          "Returned",

        assignedBy:
          "Assigned by",
      },

      assign: {
        title:
          "Assign asset",

        selectEmployee:
          "Select employee",

        note:
          "Assignment note",

        notePlaceholder:
          "Optional note...",

        assignButton:
          "Assign",

        assigning:
          "Assigning...",

        success:
          "Asset assigned successfully.",

        error:
          "Unable to assign asset.",
      },

      return: {
        title:
          "Return asset",

        note:
          "Return note",

        notePlaceholder:
          "Describe the condition of the returned asset...",

        returnButton:
          "Return asset",

        returning:
          "Returning...",

        success:
          "Asset returned successfully.",

        error:
          "Unable to return asset.",
      },
    },
  },

  vi: {
    common: {
      language:
        "Ngôn ngữ",

      english:
        "Tiếng Anh",

      vietnamese:
        "Tiếng Việt",

      loading:
        "Đang tải...",

      cancel:
        "Hủy",

      save:
        "Lưu",

      close:
        "Đóng",

      search:
        "Tìm kiếm",

      reset:
        "Đặt lại",

      logout:
        "Đăng xuất",

      all:
        "Tất cả",

      action:
        "Thao tác",

      status:
        "Trạng thái",

      priority:
        "Mức ưu tiên",

      category:
        "Danh mục",

      noData:
        "Không có dữ liệu",
    },

    auth: {
      brandName:
        "IT Helpdesk",

      brandSubtitle:
        "Quản lý tài sản",

      internalSystem:
        "Hệ thống nội bộ",

      heroTitle:
        "Quản lý yêu cầu hỗ trợ và tài sản công ty tại một nơi.",

      heroDescription:
        "Gửi yêu cầu hỗ trợ kỹ thuật, theo dõi tiến độ xử lý và quản lý các thiết bị được cấp.",

      organization:
        "Bộ phận CNTT doanh nghiệp",

      signInTitle:
        "Đăng nhập",

      signInDescription:
        "Sử dụng tài khoản công ty để tiếp tục.",

      emailLabel:
        "Địa chỉ email",

      emailPlaceholder:
        "ten@congty.com",

      passwordLabel:
        "Mật khẩu",

      passwordPlaceholder:
        "Nhập mật khẩu",

      showPassword:
        "Hiện",

      hidePassword:
        "Ẩn",

      signInButton:
        "Đăng nhập",

      signingIn:
        "Đang đăng nhập...",

      supportHint:
        "Liên hệ bộ phận IT Support nếu bạn không thể truy cập tài khoản.",

      errors: {
        invalidCredentials:
          "Email hoặc mật khẩu không chính xác.",

        inactiveAccount:
          "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ IT Support.",

        network:
          "Không thể kết nối tới máy chủ. Vui lòng thử lại.",

        generic:
          "Không thể đăng nhập. Vui lòng kiểm tra lại thông tin.",
      },
    },

    navigation: {
      workspace:
        "Không gian làm việc",

      internalPortal:
        "Cổng thông tin IT nội bộ",

      dashboard:
        "Tổng quan",

      tickets:
        "Yêu cầu hỗ trợ",

      myTickets:
        "Yêu cầu của tôi",

      assets:
        "Tài sản",

      myAssets:
        "Tài sản của tôi",

      users:
        "Người dùng",

      supportQueue:
        "Hàng đợi hỗ trợ",

      settings:
        "Cài đặt",
    },

    roles: {
      employee:
        "Nhân viên",

      itSupport:
        "IT Support",

      admin:
        "Quản trị viên",
    },

    dashboard: {
      admin: {
        title:
          "Tổng quan hệ thống",

        description:
          "Tình hình hiện tại của Helpdesk và hệ thống quản lý tài sản.",

        totalTickets:
          "Tổng yêu cầu",

        openTickets:
          "Yêu cầu đang mở",

        assets:
          "Tài sản",

        assignedAssets:
          "Tài sản đã cấp",

        activeUsers:
          "Người dùng đang hoạt động",

        averageRating:
          "Đánh giá trung bình",

        ticketStatus:
          "Trạng thái yêu cầu",

        ticketStatusDescription:
          "Phân bố trạng thái các yêu cầu hiện tại.",

        assetStatus:
          "Trạng thái tài sản",

        assetStatusDescription:
          "Tình trạng sử dụng thiết bị hiện tại.",

        open:
          "Đang mở",

        assigned:
          "Đã phân công",

        inProgress:
          "Đang xử lý",

        waitingForUser:
          "Chờ người dùng",

        resolved:
          "Đã xử lý",

        closed:
          "Đã đóng",

        available:
          "Có sẵn",

        maintenance:
          "Bảo trì",

        retired:
          "Ngừng sử dụng",

        loadError:
          "Không thể tải dữ liệu tổng quan.",
      },

      employee: {
        title:
          "Không gian làm việc",

        description:
          "Tổng quan các yêu cầu hỗ trợ và thiết bị được cấp cho bạn.",

        totalTickets:
          "Tổng yêu cầu",

        activeTickets:
          "Yêu cầu đang hoạt động",

        closedTickets:
          "Yêu cầu đã đóng",

        assignedAssets:
          "Tài sản được cấp",

        recentTickets:
          "Yêu cầu gần đây",

        recentTicketsDescription:
          "Các yêu cầu hỗ trợ mới nhất của bạn.",

        noTickets:
          "Chưa có yêu cầu",

        noTicketsDescription:
          "Các yêu cầu hỗ trợ bạn gửi sẽ xuất hiện tại đây.",
      },

      support: {
        title:
          "Không gian hỗ trợ",

        description:
          "Xem và quản lý các yêu cầu hiện đang được giao cho bạn.",

        assigned:
          "Đã phân công",

        inProgress:
          "Đang xử lý",

        waiting:
          "Đang chờ",

        resolved:
          "Đã xử lý",

        currentQueue:
          "Hàng đợi hiện tại",

        currentQueueDescription:
          "Các yêu cầu hiện đang được giao cho bạn.",

        clearQueue:
          "Không có yêu cầu chờ xử lý",

        clearQueueDescription:
          "Hiện tại không có yêu cầu đang hoạt động được giao cho bạn.",
      },
    },

    tickets: {
      title:
        "Yêu cầu hỗ trợ",

      employeeTitle:
        "Yêu cầu của tôi",

      supportTitle:
        "Hàng đợi hỗ trợ",

      adminTitle:
        "Quản lý yêu cầu",

      description:
        "Quản lý và theo dõi các yêu cầu hỗ trợ kỹ thuật.",

      employeeDescription:
        "Xem và theo dõi các yêu cầu hỗ trợ bạn đã gửi.",

      supportDescription:
        "Xem và xử lý các yêu cầu hiện đang được giao cho bạn.",

      adminDescription:
        "Theo dõi và quản lý các yêu cầu hỗ trợ trong hệ thống.",

      createTicket:
        "Tạo yêu cầu",

      searchPlaceholder:
        "Tìm theo mã, tiêu đề hoặc mô tả...",

      ticketCode:
        "Mã yêu cầu",

      titleColumn:
        "Tiêu đề",

      category:
        "Danh mục",

      priority:
        "Mức ưu tiên",

      status:
        "Trạng thái",

      createdAt:
        "Ngày tạo",

      assignedTo:
        "Người xử lý",

      total:
        "yêu cầu",

      noTickets:
        "Không tìm thấy yêu cầu",

      noTicketsDescription:
        "Không có yêu cầu phù hợp với bộ lọc hiện tại.",

      loadError:
        "Không thể tải danh sách yêu cầu.",

      filters: {
        status:
          "Trạng thái",

        priority:
          "Mức ưu tiên",

        allStatuses:
          "Tất cả trạng thái",

        allPriorities:
          "Tất cả mức ưu tiên",
      },

      statuses: {
        OPEN:
          "Đang mở",

        ASSIGNED:
          "Đã phân công",

        IN_PROGRESS:
          "Đang xử lý",

        WAITING_FOR_USER:
          "Chờ người dùng",

        RESOLVED:
          "Đã xử lý",

        CLOSED:
          "Đã đóng",
      },

      priorities: {
        LOW:
          "Thấp",

        MEDIUM:
          "Trung bình",

        HIGH:
          "Cao",

        URGENT:
          "Khẩn cấp",
      },

      create: {
        title:
          "Tạo yêu cầu",

        description:
          "Gửi yêu cầu hỗ trợ kỹ thuật mới.",

        ticketTitle:
          "Tiêu đề",

        titlePlaceholder:
          "Mô tả ngắn gọn vấn đề",

        category:
          "Danh mục",

        priority:
          "Mức ưu tiên",

        descriptionLabel:
          "Mô tả",

        descriptionPlaceholder:
          "Cung cấp thông tin chi tiết về sự cố...",

        createButton:
          "Tạo yêu cầu",

        creating:
          "Đang tạo...",

        success:
          "Đã tạo yêu cầu thành công.",

        error:
          "Không thể tạo yêu cầu.",
      },

      detail: {
        title:
          "Chi tiết yêu cầu",

        overview:
          "Tổng quan",

        description:
          "Mô tả",

        createdBy:
          "Người tạo",

        assignedTo:
          "Người xử lý",

        category:
          "Danh mục",

        priority:
          "Mức ưu tiên",

        status:
          "Trạng thái",

        createdAt:
          "Ngày tạo",

        updatedAt:
          "Cập nhật lần cuối",

        linkedAsset:
          "Tài sản liên quan",

        noAsset:
          "Chưa liên kết tài sản",

        comments:
          "Bình luận",

        addComment:
          "Thêm bình luận",

        commentPlaceholder:
          "Nhập bình luận...",

        sendComment:
          "Gửi bình luận",

        sendingComment:
          "Đang gửi...",

        history:
          "Lịch sử trạng thái",

        rating:
          "Đánh giá",

        noRating:
          "Chưa có đánh giá",

        back:
          "Quay lại danh sách yêu cầu",

        loadError:
          "Không thể tải chi tiết yêu cầu.",
      },

      assign: {
        title:
          "Phân công yêu cầu",

        selectSupport:
          "Chọn nhân viên IT Support",

        assignButton:
          "Phân công",

        assigning:
          "Đang phân công...",

        success:
          "Đã phân công yêu cầu thành công.",

        error:
          "Không thể phân công yêu cầu.",
      },

      updateStatus: {
        title:
          "Cập nhật trạng thái",

        selectStatus:
          "Chọn trạng thái",

        note:
          "Ghi chú xử lý",

        notePlaceholder:
          "Nhập ghi chú cho lần cập nhật trạng thái này...",

        updateButton:
          "Cập nhật trạng thái",

        updating:
          "Đang cập nhật...",

        success:
          "Đã cập nhật trạng thái yêu cầu.",

        error:
          "Không thể cập nhật trạng thái yêu cầu.",
      },

      statusActions: {
        start:
          "Bắt đầu xử lý",

        waiting:
          "Chờ người dùng",

        resume:
          "Tiếp tục xử lý",

        resolve:
          "Hoàn tất xử lý",

        close:
          "Xác nhận và đóng",

        confirmTitle:
          "Xác nhận xử lý",
      },

      rating: {
        title:
          "Đánh giá hỗ trợ",

        selectRating:
          "Chọn mức đánh giá",

        comment:
          "Nhận xét",

        commentPlaceholder:
          "Chia sẻ trải nghiệm hỗ trợ của bạn...",

        submit:
          "Gửi đánh giá",

        submitting:
          "Đang gửi...",

        success:
          "Đã gửi đánh giá thành công.",

        error:
          "Không thể gửi đánh giá.",
      },
    },

    users: {
      title:
        "Người dùng",

      description:
        "Quản lý tài khoản và quyền truy cập hệ thống.",

      addUser:
        "Thêm nhân viên",

      searchPlaceholder:
        "Tìm theo tên, email, vai trò hoặc phòng ban...",

      usersCount:
        "người dùng",

      fullName:
        "Họ và tên",

      email:
        "Email",

      role:
        "Vai trò",

      department:
        "Phòng ban",

      departmentId:
        "Mã phòng ban",

      status:
        "Trạng thái",

      action:
        "Thao tác",

      active:
        "Đang hoạt động",

      inactive:
        "Đã vô hiệu hóa",

      activate:
        "Kích hoạt",

      deactivate:
        "Vô hiệu hóa",

      initialPassword:
        "Mật khẩu ban đầu",

      optional:
        "Không bắt buộc",

      createTitle:
        "Thêm nhân viên",

      createDescription:
        "Tạo tài khoản mới và phân quyền cho người dùng.",

      createUser:
        "Tạo tài khoản",

      creating:
        "Đang tạo...",

      createSuccess:
        "Đã tạo người dùng thành công.",

      createError:
        "Không thể tạo người dùng.",

      loadError:
        "Không thể tải danh sách người dùng.",

      statusSuccess:
        "Đã cập nhật trạng thái người dùng.",

      statusError:
        "Không thể cập nhật trạng thái người dùng.",

      noUsers:
        "Không tìm thấy người dùng",

      noUsersDescription:
        "Không có người dùng phù hợp với bộ lọc hiện tại.",

      filters: {
        allRoles:
          "Tất cả vai trò",

        allStatuses:
          "Tất cả trạng thái",
      },

      noDepartment:
        "Không có phòng ban",

      you:
        "Bạn",

      updating:
        "Đang cập nhật...",

      cannotDeactivateSelf:
        "Bạn không thể vô hiệu hóa tài khoản của chính mình",
    },

    assets: {
      title:
        "Tài sản",

      description:
        "Xem và quản lý các thiết bị CNTT của công ty.",

      addAsset:
        "Thêm tài sản",

      searchPlaceholder:
        "Tìm kiếm tài sản...",

      assetsCount:
        "tài sản",

      assetCode:
        "Mã tài sản",

      assetName:
        "Tên tài sản",

      categoryId:
        "Mã danh mục",

      category:
        "Danh mục",

      locationId:
        "Mã vị trí",

      location:
        "Vị trí",

      brand:
        "Thương hiệu",

      model:
        "Model",

      serialNumber:
        "Số serial",

      purchaseDate:
        "Ngày mua",

      warrantyExpiration:
        "Hết hạn bảo hành",

      notes:
        "Ghi chú",

      status:
        "Trạng thái",

      assignedTo:
        "Người sử dụng",

      filters: {
        allStatuses:
          "Tất cả trạng thái",

        allCategories:
          "Tất cả danh mục",

        allLocations:
          "Tất cả vị trí",
      },

      createTitle:
        "Thêm tài sản",

      createDescription:
        "Đăng ký thiết bị CNTT mới vào hệ thống quản lý tài sản.",

      createAsset:
        "Tạo tài sản",

      creating:
        "Đang tạo...",

      createSuccess:
        "Đã thêm tài sản thành công.",

      createError:
        "Không thể thêm tài sản.",

      loadError:
        "Không thể tải danh sách tài sản.",

      noAssets:
        "Không tìm thấy tài sản",

      noAssetsDescription:
        "Không có tài sản phù hợp với tìm kiếm.",

      statuses: {
        AVAILABLE:
          "Có sẵn",

        ASSIGNED:
          "Đã cấp",

        MAINTENANCE:
          "Bảo trì",

        RETIRED:
          "Ngừng sử dụng",
      },

      detail: {
        title:
          "Chi tiết tài sản",

        information:
          "Thông tin tài sản",

        assignmentHistory:
          "Lịch sử cấp phát",

        noHistory:
          "Chưa có lịch sử cấp phát",

        back:
          "Quay lại danh sách tài sản",

        loadError:
          "Không thể tải chi tiết tài sản.",

        assignedDate:
          "Ngày cấp",

        returnedDate:
          "Ngày thu hồi",

        assignedBy:
          "Người cấp",
      },

      assign: {
        title:
          "Cấp tài sản",

        selectEmployee:
          "Chọn nhân viên",

        note:
          "Ghi chú cấp phát",

        notePlaceholder:
          "Ghi chú không bắt buộc...",

        assignButton:
          "Cấp tài sản",

        assigning:
          "Đang cấp...",

        success:
          "Đã cấp tài sản thành công.",

        error:
          "Không thể cấp tài sản.",
      },

      return: {
        title:
          "Thu hồi tài sản",

        note:
          "Ghi chú thu hồi",

        notePlaceholder:
          "Mô tả tình trạng thiết bị khi thu hồi...",

        returnButton:
          "Thu hồi tài sản",

        returning:
          "Đang thu hồi...",

        success:
          "Đã thu hồi tài sản thành công.",

        error:
          "Không thể thu hồi tài sản.",
      },
    },
  },
};

export default translations;