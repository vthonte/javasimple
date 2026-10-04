// Master Tour Sequential Registry
const TOUR_STEPS = [
  { id: "step-01", title: "01. Java Fundamentals for Node Devs", path: "00_java_fundamentals_for_beginners.html", track: "Track 1: Java Foundations" },
  { id: "step-02", title: "02. Core Java Control Flow & Loops", path: "topics/loops_and_control_flow.html", track: "Track 1: Java Foundations" },
  { id: "step-03", title: "03. Core OOP, Inheritance & Interfaces", path: "topics/oop_classes_inheritance_interfaces.html", track: "Track 1: Java Foundations" },
  { id: "step-04", title: "04. JVM Architecture & JIT Compiler", path: "topics/jvm.html", track: "Track 1: Java Foundations" },
  { id: "step-05", title: "05. JVM Memory (Stack vs Heap)", path: "topics/memory_management.html", track: "Track 1: Java Foundations" },
  { id: "step-06", title: "06. Modern Garbage Collection (G1/ZGC)", path: "topics/garbage_collection.html", track: "Track 1: Java Foundations" },
  { id: "step-07", title: "07. Collections Internals & Hashing", path: "topics/collections_internals.html", track: "Track 1: Java Foundations" },

  { id: "step-08", title: "08. Spring Boot 101 for Beginners", path: "topics/spring_boot_for_beginners.html", track: "Track 2: Spring Boot Fundamentals" },
  { id: "step-09", title: "09. Auto-Configuration Magic", path: "topics/spring_boot_auto_configuration.html", track: "Track 2: Spring Boot Fundamentals" },
  { id: "step-10", title: "10. REST Controllers & Routing", path: "topics/rest_controllers_and_routing.html", track: "Track 2: Spring Boot Fundamentals" },
  { id: "step-11", title: "11. Global Exception Handling", path: "topics/global_exception_handling.html", track: "Track 2: Spring Boot Fundamentals" },
  { id: "step-12", title: "12. Configuration & Spring Profiles", path: "topics/configuration_and_profiles.html", track: "Track 2: Spring Boot Fundamentals" },
  { id: "step-13", title: "13. Spring Boot Testing (JUnit 5 & Mockito)", path: "topics/spring_boot_testing.html", track: "Track 2: Spring Boot Fundamentals" },
  { id: "step-14", title: "14. Actuator & Production Observability", path: "topics/spring_boot_actuator.html", track: "Track 2: Spring Boot Fundamentals" },

  { id: "step-15", title: "15. Node.js Event Loop & libuv", path: "topics/event_loop.html", track: "Track 3: Concurrency & Async" },
  { id: "step-16", title: "16. Java Platform Threads & Pools", path: "topics/threads_in_java.html", track: "Track 3: Concurrency & Async" },
  { id: "step-17", title: "17. Java 21 Virtual Threads (Loom)", path: "topics/virtual_threads.html", track: "Track 3: Concurrency & Async" },
  { id: "step-18", title: "18. Streams API & Lazy Pipelines", path: "topics/streams_and_lambdas.html", track: "Track 3: Concurrency & Async" },
  { id: "step-19", title: "19. CompletableFuture & Reactive Systems", path: "topics/completable_future_and_reactive.html", track: "Track 3: Concurrency & Async" },

  { id: "step-20", title: "20. Spring IoC Container & Bean Lifecycle", path: "topics/spring_ioc.html", track: "Track 4: Spring Framework" },
  { id: "step-21", title: "21. Spring Security & Stateless JWT", path: "topics/spring_security_and_jwt.html", track: "Track 4: Spring Framework" },
  { id: "step-22", title: "22. Spring AOP & Dynamic Proxies", path: "topics/spring_aop_and_proxies.html", track: "Track 4: Spring Framework" },

  { id: "step-23", title: "23. Hibernate & JPA Internals", path: "topics/hibernate_and_jpa.html", track: "Track 5: Database & Transactions" },
  { id: "step-24", title: "24. The N+1 Query Trap & Fixes", path: "topics/n_plus_one_and_performance.html", track: "Track 5: Database & Transactions" },
  { id: "step-25", title: "25. Transactions & Isolation Levels", path: "topics/transactions_and_isolation.html", track: "Track 5: Database & Transactions" },

  { id: "step-26", title: "26. Distributed Transactions & Sagas", path: "topics/distributed_transactions_saga.html", track: "Track 6: Distributed & Production Ops" },
  { id: "step-27", title: "27. Resilience4j Circuit Breakers", path: "topics/resilience_and_circuit_breakers.html", track: "Track 6: Distributed & Production Ops" },
  { id: "step-28", title: "28. Production Profiling & JFR", path: "topics/profiling_and_debugging.html", track: "Track 6: Distributed & Production Ops" },
  { id: "step-29", title: "29. Production Outage Incident Playbooks", path: "topics/production_outage_playbooks.html", track: "Track 6: Distributed & Production Ops" }
];

(function initMasterTour() {
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  
  // Find current step index
  let currentIndex = TOUR_STEPS.findIndex(step => currentPath.endsWith(step.path));
  if (currentIndex === -1) {
    // If on master index or unspecified, just handle tracking
    return;
  }

  const currentStep = TOUR_STEPS[currentIndex];
  const prevStep = currentIndex > 0 ? TOUR_STEPS[currentIndex - 1] : null;
  const nextStep = currentIndex < TOUR_STEPS.length - 1 ? TOUR_STEPS[currentIndex + 1] : null;

  // Mark current step as completed in localStorage
  const completed = JSON.parse(localStorage.getItem('tour_completed_steps') || '{}');
  completed[currentStep.id] = true;
  localStorage.setItem('tour_completed_steps', JSON.stringify(completed));

  // Count completed
  const completedCount = Object.keys(completed).length;
  const progressPercent = Math.round((completedCount / TOUR_STEPS.length) * 100);

  // Helper to adjust relative path depending on depth
  const isTopicsFolder = currentPath.includes('/topics/');
  const rootPrefix = isTopicsFolder ? '../' : './';
  const getStepUrl = (step) => {
    if (!step) return '#';
    if (isTopicsFolder) {
      return step.path.startsWith('topics/') ? step.path.replace('topics/', '') : '../' + step.path;
    } else {
      return step.path;
    }
  };

  // Inject Tour Floating Bar
  const navContainer = document.createElement('div');
  navContainer.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 pointer-events-none';
  navContainer.innerHTML = `
    <div class="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 shadow-2xl rounded-2xl p-3 sm:px-6 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <a href="${rootPrefix}index.html" class="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors">
          <span class="font-bold">🗺️ Tour Hub</span>
        </a>
        <span class="text-slate-600 hidden sm:inline">|</span>
        <div class="hidden sm:block">
          <div class="text-[11px] text-indigo-400 font-mono font-semibold">${currentStep.track}</div>
          <div class="text-xs font-bold text-slate-100 truncate max-w-xs">${currentStep.title}</div>
        </div>
      </div>

      <!-- Center Progress -->
      <div class="flex items-center gap-2">
        <div class="w-24 sm:w-36 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
          <div class="bg-gradient-to-r from-emerald-500 to-indigo-500 h-2 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
        </div>
        <span class="text-[11px] font-mono text-emerald-400 font-bold">${currentIndex + 1}/${TOUR_STEPS.length}</span>
      </div>

      <!-- Next / Prev Controls -->
      <div class="flex items-center gap-2">
        ${prevStep ? `
          <a href="${getStepUrl(prevStep)}" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors">
            ← Prev
          </a>
        ` : `
          <button disabled class="px-3 py-1.5 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-600 text-xs font-semibold cursor-not-allowed">
            Start
          </button>
        `}

        ${nextStep ? `
          <a href="${getStepUrl(nextStep)}" class="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1 transition-all">
            Next Lesson →
          </a>
        ` : `
          <a href="${rootPrefix}index.html" class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1 transition-all">
            🎉 Finish Tour!
          </a>
        `}
      </div>
    </div>
  `;

  document.body.appendChild(navContainer);
})();
