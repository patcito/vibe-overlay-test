"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuthModule: () => AuthModule,
  CommentListModule: () => CommentListModule,
  OverlayModule: () => OverlayModule,
  PreviewModule: () => PreviewModule,
  ToolbarModule: () => ToolbarModule,
  VibeInstance: () => VibeInstance,
  blobToDataURL: () => blobToDataURL,
  captureElementScreenshot: () => captureElementScreenshot,
  captureMetadata: () => captureMetadata,
  initVibe: () => initVibe,
  uploadScreenshot: () => uploadScreenshot
});
module.exports = __toCommonJS(index_exports);
var import_supabase_js = require("@supabase/supabase-js");

// src/auth.ts
var AuthModule = class {
  constructor(supabase, user) {
    this.supabase = supabase;
    this.providedUser = user;
  }
  async checkAuth() {
    if (this.providedUser) {
      return true;
    }
    const { data: { session } } = await this.supabase.auth.getSession();
    return !!session;
  }
  async showLoginModal() {
    return new Promise((resolve, reject) => {
      this.createLoginModal(resolve, reject);
    });
  }
  createLoginModal(resolve, reject) {
    const backdrop = document.createElement("div");
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    const modal = document.createElement("div");
    modal.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    `;
    const form = document.createElement("form");
    form.innerHTML = `
      <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">Sign in to Vibe Viewer</h2>
      <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">Enter your email to receive a magic link</p>
      <input
        type="email"
        placeholder="Enter your email"
        required
        style="
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 16px;
          box-sizing: border-box;
          font-size: 14px;
        "
      />
      <div style="display: flex; gap: 12px;">
        <button
          type="submit"
          style="
            flex: 1;
            background: #000;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          "
        >Send Magic Link</button>
        <button
          type="button"
          class="cancel"
          style="
            background: #f5f5f5;
            color: #666;
            border: none;
            padding: 12px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          "
        >Cancel</button>
      </div>
    `;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      try {
        const { error } = await this.supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.href
          }
        });
        if (error) throw error;
        modal.innerHTML = `
          <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">Check your email</h2>
          <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">
            We've sent a magic link to <strong>${email}</strong>.
            Click the link in the email to sign in.
          </p>
          <button
            class="close"
            style="
              width: 100%;
              background: #000;
              color: white;
              border: none;
              padding: 12px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            "
          >Close</button>
        `;
        modal.querySelector(".close")?.addEventListener("click", () => {
          document.body.removeChild(backdrop);
          resolve();
        });
      } catch (error) {
        alert("Error sending magic link: " + error.message);
        reject(error);
      }
    });
    form.querySelector(".cancel")?.addEventListener("click", () => {
      document.body.removeChild(backdrop);
      reject(new Error("Login cancelled"));
    });
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        document.body.removeChild(backdrop);
        reject(new Error("Login cancelled"));
      }
    });
    modal.appendChild(form);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    this.modal = backdrop;
  }
  async getCurrentUser() {
    if (this.providedUser) {
      return this.providedUser;
    }
    const { data: { session } } = await this.supabase.auth.getSession();
    if (session?.user) {
      return {
        id: session.user.id,
        email: session.user.email || ""
      };
    }
    return null;
  }
};

// src/metadata.ts
function captureMetadata() {
  const userAgent = navigator.userAgent;
  const browser = parseBrowser(userAgent);
  const os = parseOS(userAgent);
  return {
    browser,
    os,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1
    },
    page: {
      url: window.location.href,
      path: window.location.pathname,
      title: document.title
    },
    user: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function parseBrowser(userAgent) {
  let name = "Unknown";
  let version = "Unknown";
  if (userAgent.includes("Chrome/") && !userAgent.includes("Edg/")) {
    name = "Chrome";
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
    if (match) version = match[1];
  } else if (userAgent.includes("Firefox/")) {
    name = "Firefox";
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    if (match) version = match[1];
  } else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) {
    name = "Safari";
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    if (match) version = match[1];
  } else if (userAgent.includes("Edg/")) {
    name = "Edge";
    const match = userAgent.match(/Edg\/(\d+\.\d+)/);
    if (match) version = match[1];
  }
  return { name, version, userAgent };
}
function parseOS(userAgent) {
  let name = "Unknown";
  let version = "Unknown";
  if (userAgent.includes("Windows NT")) {
    name = "Windows";
    const match = userAgent.match(/Windows NT (\d+\.\d+)/);
    if (match) {
      const ntVersion = match[1];
      const windowsVersionMap = {
        "10.0": "10/11",
        "6.3": "8.1",
        "6.2": "8",
        "6.1": "7"
      };
      version = windowsVersionMap[ntVersion] || ntVersion;
    }
  } else if (userAgent.includes("Mac OS X")) {
    name = "macOS";
    const match = userAgent.match(/Mac OS X (\d+[._]\d+([._]\d+)?)/);
    if (match) {
      version = match[1].replace(/_/g, ".");
    }
  } else if (userAgent.includes("Linux")) {
    name = "Linux";
    if (userAgent.includes("Ubuntu")) version = "Ubuntu";
    else if (userAgent.includes("Android")) {
      name = "Android";
      const match = userAgent.match(/Android (\d+\.\d+)/);
      if (match) version = match[1];
    }
  } else if (userAgent.includes("iPhone OS") || userAgent.includes("OS ")) {
    name = "iOS";
    const match = userAgent.match(/OS (\d+[._]\d+([._]\d+)?)/);
    if (match) {
      version = match[1].replace(/_/g, ".");
    }
  }
  return { name, version };
}

// src/screenshot.ts
var import_html2canvas = __toESM(require("html2canvas"));
async function captureElementScreenshot(element) {
  try {
    const canvas = await (0, import_html2canvas.default)(element, {
      allowTaint: true,
      useCORS: true,
      scale: 1,
      backgroundColor: null,
      removeContainer: true,
      imageTimeout: 5e3,
      width: element.offsetWidth,
      height: element.offsetHeight
    });
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob from canvas"));
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, "image/png", 0.9);
    });
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    throw error;
  }
}
async function uploadScreenshot(blob, supabaseClient, bucket = "screenshots") {
  try {
    const fileName = `screenshot-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const { data, error } = await supabaseClient.storage.from(bucket).upload(fileName, blob, {
      contentType: "image/png",
      cacheControl: "3600"
    });
    if (error) throw error;
    const { data: publicData } = supabaseClient.storage.from(bucket).getPublicUrl(fileName);
    return publicData.publicUrl;
  } catch (error) {
    console.error("Error uploading screenshot:", error);
    throw error;
  }
}
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// src/preview.ts
var PreviewModule = class {
  constructor() {
    this.previews = /* @__PURE__ */ new Map();
    this.isActive = false;
  }
  init() {
    if (this.isActive) return;
    this.detectExistingPreviews();
    this.setupMutationObserver();
    this.isActive = true;
  }
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = void 0;
    }
    this.previews.forEach((preview) => this.cleanupPreview(preview));
    this.previews.clear();
    this.isActive = false;
  }
  detectExistingPreviews() {
    const previewElements = document.querySelectorAll("[data-preview-comment], Preview");
    previewElements.forEach((element) => {
      this.processPreviewElement(element);
    });
  }
  setupMutationObserver() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            if (this.isPreviewElement(element)) {
              this.processPreviewElement(element);
            }
            const previewsInside = element.querySelectorAll?.("[data-preview-comment], Preview");
            previewsInside?.forEach((preview) => {
              this.processPreviewElement(preview);
            });
          }
        });
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            if (element.hasAttribute?.("data-preview-comment")) {
              const commentId = element.getAttribute("data-preview-comment");
              this.removePreview(commentId);
            }
          }
        });
      });
    });
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-preview-comment"]
    });
  }
  isPreviewElement(element) {
    return element.tagName === "PREVIEW" || element.hasAttribute("data-preview-comment");
  }
  processPreviewElement(element) {
    let commentId = null;
    if (element.tagName === "PREVIEW") {
      commentId = element.getAttribute("commentId");
    }
    if (element.hasAttribute("data-preview-comment")) {
      commentId = element.getAttribute("data-preview-comment");
    }
    if (!commentId) return;
    if (this.previews.has(commentId)) return;
    this.addPreviewHighlight(element, commentId);
  }
  addPreviewHighlight(element, commentId) {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      position: relative;
      outline: 2px solid #10b981;
      outline-offset: 2px;
      border-radius: 4px;
      animation: previewPulse 2s infinite;
    `;
    if (!document.getElementById("vibe-preview-styles")) {
      const styles = document.createElement("style");
      styles.id = "vibe-preview-styles";
      styles.textContent = `
        @keyframes previewPulse {
          0%, 100% { outline-color: #10b981; }
          50% { outline-color: #6ee7b7; }
        }
        .vibe-preview-badge {
          transition: all 0.2s ease;
        }
        .vibe-preview-badge:hover {
          transform: scale(1.1);
        }
        .vibe-preview-tooltip {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .vibe-preview-tooltip.show {
          opacity: 1;
          pointer-events: auto;
        }
      `;
      document.head.appendChild(styles);
    }
    if (element.parentNode) {
      element.parentNode.insertBefore(wrapper, element);
      wrapper.appendChild(element);
    }
    const badge = this.createCommentBadge(commentId);
    wrapper.appendChild(badge);
    const tooltip = this.createHoverTooltip(commentId);
    wrapper.appendChild(tooltip);
    const preview = {
      element,
      commentId,
      wrapper,
      badge,
      tooltip
    };
    this.previews.set(commentId, preview);
    this.setupHoverEvents(preview);
  }
  createCommentBadge(commentId) {
    const badge = document.createElement("div");
    badge.className = "vibe-preview-badge";
    badge.style.cssText = `
      position: absolute;
      top: -12px;
      right: -12px;
      width: 24px;
      height: 24px;
      background: #10b981;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      z-index: 999998;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    badge.textContent = "\u{1F441}";
    badge.title = `Preview for comment #${commentId}`;
    badge.addEventListener("click", () => {
      this.openCommentThread(commentId);
    });
    return badge;
  }
  createHoverTooltip(commentId) {
    const tooltip = document.createElement("div");
    tooltip.className = "vibe-preview-tooltip";
    tooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: #1f2937;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 999999;
      margin-bottom: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    const arrow = document.createElement("div");
    arrow.style.cssText = `
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #1f2937;
    `;
    tooltip.appendChild(arrow);
    tooltip.innerHTML = `
      <div>Preview: Comment #${commentId}</div>
      <div style="font-size: 10px; opacity: 0.8; margin-top: 4px;">Click badge to view details</div>
      ${arrow.outerHTML}
    `;
    return tooltip;
  }
  setupHoverEvents(preview) {
    if (!preview.wrapper || !preview.tooltip) return;
    preview.wrapper.addEventListener("mouseenter", () => {
      preview.tooltip?.classList.add("show");
    });
    preview.wrapper.addEventListener("mouseleave", () => {
      preview.tooltip?.classList.remove("show");
    });
  }
  openCommentThread(commentId) {
    const event = new CustomEvent("vibe:openComment", {
      detail: { commentId }
    });
    window.dispatchEvent(event);
    const commentPin = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (commentPin) {
      commentPin.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  removePreview(commentId) {
    const preview = this.previews.get(commentId);
    if (!preview) return;
    this.cleanupPreview(preview);
    this.previews.delete(commentId);
  }
  cleanupPreview(preview) {
    try {
      if (preview.wrapper && preview.wrapper.parentNode && preview.element) {
        preview.wrapper.parentNode.insertBefore(preview.element, preview.wrapper);
        preview.wrapper.parentNode.removeChild(preview.wrapper);
      }
    } catch (error) {
      console.warn("Error cleaning up preview element:", error);
    }
  }
  // Public method to get all detected previews
  getPreviews() {
    return Array.from(this.previews.values());
  }
  // Public method to check if preview mode should be active
  static shouldActivatePreviewMode() {
    const url = window.location.href;
    const pathname = window.location.pathname;
    const previewPatterns = [
      /\/preview\//,
      // /preview/comment-123
      /-preview-/,
      // branch-preview-abc123
      /\.preview\./,
      // subdomain.preview.domain.com
      /pr-\d+/,
      // pr-123.vercel.app
      /comment-\d+/
      // comment-123.vercel.app
    ];
    return previewPatterns.some((pattern) => pattern.test(url) || pattern.test(pathname));
  }
  // Public method to extract comment ID from URL
  static getCommentIdFromUrl() {
    const url = window.location.href;
    const pathname = window.location.pathname;
    const commentMatch = url.match(/comment[/-](\d+)/) || pathname.match(/comment[/-](\d+)/) || url.match(/preview[/-](\d+)/) || pathname.match(/preview[/-](\d+)/);
    return commentMatch ? commentMatch[1] : null;
  }
};

// src/overlay.ts
var OverlayModule = class {
  constructor(supabase, projectId) {
    this.comments = [];
    this.isActive = false;
    this.isPreviewMode = false;
    this.previewCommentId = null;
    this.supabase = supabase;
    this.projectId = projectId;
    this.previewModule = new PreviewModule();
    this.isPreviewMode = PreviewModule.shouldActivatePreviewMode();
    this.previewCommentId = PreviewModule.getCommentIdFromUrl();
  }
  async init() {
    if (this.isActive) return;
    this.createOverlay();
    if (this.isPreviewMode) {
      this.previewModule.init();
      this.createPreviewBanner();
    }
    this.attachEventListeners();
    await this.loadComments();
    this.renderCommentPins();
    this.isActive = true;
  }
  destroy() {
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      this.overlay = void 0;
    }
    if (this.previewBanner) {
      document.body.removeChild(this.previewBanner);
      this.previewBanner = void 0;
    }
    if (this.previewModule) {
      this.previewModule.destroy();
    }
    this.removeEventListeners();
    this.isActive = false;
  }
  createOverlay() {
    this.overlay = document.createElement("div");
    this.overlay.id = "vibe-overlay";
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
    `;
    document.body.appendChild(this.overlay);
  }
  attachEventListeners() {
    document.addEventListener("click", this.handleElementClick.bind(this), true);
    document.addEventListener("mouseover", this.handleElementHover.bind(this));
    document.addEventListener("mouseout", this.handleElementHoverOut.bind(this));
  }
  removeEventListeners() {
    document.removeEventListener("click", this.handleElementClick.bind(this), true);
    document.removeEventListener("mouseover", this.handleElementHover.bind(this));
    document.removeEventListener("mouseout", this.handleElementHoverOut.bind(this));
  }
  handleElementClick(event) {
    const target = event.target;
    if (target.closest("#vibe-overlay")) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.showCommentModal(target, event.clientX, event.clientY);
  }
  handleElementHover(event) {
    const target = event.target;
    if (target.closest("#vibe-overlay")) return;
    target.style.outline = "2px solid #3b82f6";
    target.style.outlineOffset = "2px";
  }
  handleElementHoverOut(event) {
    const target = event.target;
    if (target.closest("#vibe-overlay")) return;
    target.style.outline = "";
    target.style.outlineOffset = "";
  }
  showCommentModal(element, x, y) {
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 8px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      z-index: 1000000;
      pointer-events: all;
    `;
    const form = document.createElement("form");
    form.innerHTML = `
      <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Add Comment</h3>
      <textarea
        placeholder="Describe the issue or change you'd like to see..."
        required
        style="
          width: 100%;
          height: 80px;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          margin-bottom: 16px;
          box-sizing: border-box;
          font-family: inherit;
          font-size: 14px;
        "
      ></textarea>
      <div style="display: flex; gap: 12px;">
        <button
          type="submit"
          style="
            flex: 1;
            background: #000;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          "
        >Add Comment</button>
        <button
          type="button"
          class="cancel"
          style="
            background: #f5f5f5;
            color: #666;
            border: none;
            padding: 12px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          "
        >Cancel</button>
      </div>
    `;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const content = form.querySelector("textarea").value;
      await this.createComment(element, content, x, y);
      document.body.removeChild(modal);
    });
    form.querySelector(".cancel")?.addEventListener("click", () => {
      document.body.removeChild(modal);
    });
    modal.appendChild(form);
    document.body.appendChild(modal);
    const textarea = form.querySelector("textarea");
    textarea.focus();
  }
  async createComment(element, content, x, y) {
    try {
      const selector = this.getElementSelector(element);
      const xpath = this.getElementXPath(element);
      const parentChain = this.getElementParentChain(element);
      const metadata = captureMetadata();
      let screenshotUrl;
      try {
        const blobUrl = await captureElementScreenshot(element);
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        screenshotUrl = await uploadScreenshot(blob, this.supabase);
        URL.revokeObjectURL(blobUrl);
      } catch (error2) {
        console.warn("Failed to capture and upload screenshot:", error2);
      }
      const { data, error } = await this.supabase.from("comments").insert({
        project_id: this.projectId,
        page_id: null,
        // For agentic mode, we don't have page_id
        content,
        x,
        y,
        element_selector: selector,
        element_xpath: xpath,
        element_parent_chain: parentChain,
        element_screenshot_url: screenshotUrl,
        page_path: window.location.pathname,
        metadata
      }).select().single();
      if (error) throw error;
      this.comments.push(data);
      this.renderCommentPins();
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("Failed to create comment: " + error.message);
    }
  }
  getElementSelector(element) {
    const path = [];
    let current = element;
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break;
      }
      if (current.className) {
        const classes = current.className.split(" ").filter(Boolean);
        if (classes.length > 0) {
          selector += "." + classes.join(".");
        }
      }
      const siblings = Array.from(current.parentElement?.children || []).filter((sibling) => sibling.tagName === current.tagName);
      if (siblings.length > 1) {
        const index = siblings.indexOf(current);
        selector += `:nth-of-type(${index + 1})`;
      }
      path.unshift(selector);
      current = current.parentElement;
    }
    return path.join(" > ");
  }
  getElementXPath(element) {
    const path = [];
    let current = element;
    while (current && current !== document.body) {
      let index = 1;
      let sibling = current.previousElementSibling;
      while (sibling) {
        if (sibling.tagName === current.tagName) {
          index++;
        }
        sibling = sibling.previousElementSibling;
      }
      const tagName = current.tagName.toLowerCase();
      path.unshift(`${tagName}[${index}]`);
      current = current.parentElement;
    }
    return "/" + path.join("/");
  }
  getElementParentChain(element) {
    const chain = [];
    let current = element.parentElement;
    while (current && current !== document.body) {
      chain.push(this.getElementSelector(current));
      current = current.parentElement;
    }
    return chain;
  }
  async loadComments() {
    try {
      const { data, error } = await this.supabase.from("comments").select("*").eq("project_id", this.projectId).eq("page_path", window.location.pathname);
      if (error) throw error;
      this.comments = data || [];
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  }
  renderCommentPins() {
    if (!this.overlay) return;
    this.overlay.innerHTML = "";
    this.comments.forEach((comment) => {
      if (!comment.element_selector) return;
      let targetElement = document.querySelector(comment.element_selector);
      if (!targetElement && comment.element_parent_chain) {
        for (const parentSelector of comment.element_parent_chain) {
          targetElement = document.querySelector(parentSelector);
          if (targetElement) break;
        }
      }
      if (!targetElement) return;
      const rect = targetElement.getBoundingClientRect();
      const pin = document.createElement("div");
      pin.style.cssText = `
        position: absolute;
        left: ${rect.left + window.scrollX}px;
        top: ${rect.top + window.scrollY}px;
        width: 24px;
        height: 24px;
        background: #3b82f6;
        border-radius: 50%;
        border: 2px solid white;
        cursor: pointer;
        pointer-events: all;
        z-index: 1000001;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      `;
      pin.textContent = "\u{1F4AC}";
      pin.addEventListener("click", () => {
        this.showCommentDetails(comment);
      });
      this.overlay?.appendChild(pin);
    });
  }
  showCommentDetails(comment) {
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 8px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      z-index: 1000000;
      pointer-events: all;
    `;
    modal.innerHTML = `
      <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Comment</h3>
      <p style="margin: 0 0 16px 0; color: #333; line-height: 1.5;">${comment.content}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; color: #666; font-size: 12px; margin-bottom: 16px;">
        <span>Created ${new Date(comment.created_at).toLocaleString()}</span>
      </div>
      <button
        class="close"
        style="
          width: 100%;
          background: #f5f5f5;
          color: #666;
          border: none;
          padding: 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        "
      >Close</button>
    `;
    modal.querySelector(".close")?.addEventListener("click", () => {
      document.body.removeChild(modal);
    });
    document.body.appendChild(modal);
  }
  createPreviewBanner() {
    if (this.previewBanner || !this.previewCommentId) return;
    this.previewBanner = document.createElement("div");
    this.previewBanner.id = "vibe-preview-banner";
    this.previewBanner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 12px 16px;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      animation: slideDown 0.3s ease-out;
    `;
    if (!document.getElementById("vibe-banner-styles")) {
      const styles = document.createElement("style");
      styles.id = "vibe-banner-styles";
      styles.textContent = `
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .vibe-banner-button {
          transition: all 0.2s ease;
        }
        .vibe-banner-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
      `;
      document.head.appendChild(styles);
    }
    const info = document.createElement("div");
    info.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    const icon = document.createElement("span");
    icon.textContent = "\u{1F441}";
    icon.style.fontSize = "16px";
    const text = document.createElement("span");
    text.textContent = `Preview for comment #${this.previewCommentId}`;
    info.appendChild(icon);
    info.appendChild(text);
    const actions = document.createElement("div");
    actions.style.cssText = `
      display: flex;
      gap: 12px;
      align-items: center;
    `;
    const approveBtn = document.createElement("button");
    approveBtn.className = "vibe-banner-button";
    approveBtn.textContent = "Approve";
    approveBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      backdrop-filter: blur(8px);
    `;
    const requestChangesBtn = document.createElement("button");
    requestChangesBtn.className = "vibe-banner-button";
    requestChangesBtn.textContent = "Request Changes";
    requestChangesBtn.style.cssText = `
      background: rgba(239, 68, 68, 0.9);
      border: 1px solid rgba(239, 68, 68, 1);
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
    `;
    const viewCommentBtn = document.createElement("button");
    viewCommentBtn.className = "vibe-banner-button";
    viewCommentBtn.textContent = "View Comment";
    viewCommentBtn.style.cssText = `
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
    `;
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "\xD7";
    closeBtn.style.cssText = `
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.8);
      font-size: 20px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      line-height: 1;
    `;
    approveBtn.addEventListener("click", () => this.handlePreviewApproval(true));
    requestChangesBtn.addEventListener("click", () => this.handlePreviewApproval(false));
    viewCommentBtn.addEventListener("click", () => this.openCommentThread());
    closeBtn.addEventListener("click", () => this.hidePreviewBanner());
    actions.appendChild(viewCommentBtn);
    actions.appendChild(requestChangesBtn);
    actions.appendChild(approveBtn);
    actions.appendChild(closeBtn);
    this.previewBanner.appendChild(info);
    this.previewBanner.appendChild(actions);
    document.body.appendChild(this.previewBanner);
    const originalPadding = document.body.style.paddingTop;
    document.body.style.paddingTop = `calc(${originalPadding || "0px"} + 48px)`;
    this.previewBanner.setAttribute("data-original-padding", originalPadding);
  }
  handlePreviewApproval(approved) {
    if (!this.previewCommentId) return;
    const action = approved ? "approve" : "request_changes";
    const event = new CustomEvent("vibe:previewAction", {
      detail: {
        commentId: this.previewCommentId,
        action,
        approved
      }
    });
    window.dispatchEvent(event);
    this.showPreviewActionFeedback(approved);
  }
  showPreviewActionFeedback(approved) {
    const feedback = document.createElement("div");
    feedback.style.cssText = `
      position: fixed;
      top: 60px;
      right: 16px;
      background: ${approved ? "#10b981" : "#ef4444"};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000000;
      animation: slideInRight 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    feedback.textContent = approved ? "\u2713 Preview approved" : "\u26A0 Changes requested";
    document.body.appendChild(feedback);
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 3e3);
  }
  openCommentThread() {
    if (!this.previewCommentId) return;
    const event = new CustomEvent("vibe:openComment", {
      detail: { commentId: this.previewCommentId }
    });
    window.dispatchEvent(event);
  }
  hidePreviewBanner() {
    if (!this.previewBanner) return;
    const originalPadding = this.previewBanner.getAttribute("data-original-padding") || "0px";
    document.body.style.paddingTop = originalPadding;
    document.body.removeChild(this.previewBanner);
    this.previewBanner = void 0;
  }
  // Public methods for preview functionality
  isInPreviewMode() {
    return this.isPreviewMode;
  }
  getPreviewCommentId() {
    return this.previewCommentId;
  }
  getPreviews() {
    return this.previewModule.getPreviews();
  }
};

// src/toolbar.ts
var ToolbarModule = class {
  constructor(supabase, config) {
    this.data = {
      commentCount: 0,
      activeComments: 0,
      previewComments: 0,
      deployedComments: 0
    };
    this.isVisible = false;
    this.isExpanded = false;
    this.supabase = supabase;
    this.config = config;
  }
  async init() {
    if (this.toolbar) return;
    this.createToolbar();
    await this.loadData();
    this.attachEventListeners();
    this.show();
  }
  destroy() {
    if (this.toolbar) {
      document.body.removeChild(this.toolbar);
      this.toolbar = void 0;
    }
    this.removeEventListeners();
    this.isVisible = false;
    this.isExpanded = false;
  }
  createToolbar() {
    this.toolbar = document.createElement("div");
    this.toolbar.id = "vibe-toolbar";
    const positionStyles = this.getPositionStyles();
    this.toolbar.style.cssText = `
      position: fixed;
      ${positionStyles}
      z-index: 999997;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      opacity: 0;
      transform: scale(0.8) ${this.getTransformDirection()};
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    `;
    if (!document.getElementById("vibe-toolbar-styles")) {
      this.addToolbarStyles();
    }
    this.renderToolbar();
    document.body.appendChild(this.toolbar);
  }
  addToolbarStyles() {
    const styles = document.createElement("style");
    styles.id = "vibe-toolbar-styles";
    styles.textContent = `
      .vibe-toolbar-visible {
        opacity: 1 !important;
        transform: scale(1) translate(0) !important;
        pointer-events: auto !important;
      }

      .vibe-toolbar-btn {
        transition: all 0.2s ease;
        cursor: pointer;
        border: none;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .vibe-toolbar-btn:hover {
        transform: scale(1.05);
      }

      .vibe-toolbar-btn:active {
        transform: scale(0.95);
      }

      .vibe-toolbar-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #ef4444;
        color: white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        font-size: 10px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        min-width: 16px;
        box-sizing: border-box;
      }

      .vibe-toolbar-expanded {
        animation: expandToolbar 0.3s ease-out;
      }

      .vibe-toolbar-collapsed {
        animation: collapseToolbar 0.3s ease-out;
      }

      @keyframes expandToolbar {
        from { max-width: 56px; }
        to { max-width: 300px; }
      }

      @keyframes collapseToolbar {
        from { max-width: 300px; }
        to { max-width: 56px; }
      }

      .vibe-fade-in {
        animation: vibeToolbarFadeIn 0.3s ease-out;
      }

      @keyframes vibeToolbarFadeIn {
        from { opacity: 0; transform: translateX(10px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(styles);
  }
  getPositionStyles() {
    const margin = "20px";
    switch (this.config.position) {
      case "top-right":
        return `top: ${margin}; right: ${margin};`;
      case "bottom-right":
        return `bottom: ${margin}; right: ${margin};`;
      case "top-left":
        return `top: ${margin}; left: ${margin};`;
      case "bottom-left":
        return `bottom: ${margin}; left: ${margin};`;
      default:
        return `bottom: ${margin}; right: ${margin};`;
    }
  }
  getTransformDirection() {
    switch (this.config.position) {
      case "top-right":
        return "translate(10px, -10px)";
      case "bottom-right":
        return "translate(10px, 10px)";
      case "top-left":
        return "translate(-10px, -10px)";
      case "bottom-left":
        return "translate(-10px, 10px)";
      default:
        return "translate(10px, 10px)";
    }
  }
  renderToolbar() {
    if (!this.toolbar) return;
    const isCollapsed = !this.isExpanded;
    this.toolbar.innerHTML = `
      <div class="vibe-toolbar-container" style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 28px;
        padding: 8px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: ${isCollapsed ? "56px" : "300px"};
        overflow: hidden;
        transition: all 0.3s ease;
      ">
        <!-- Main Toggle Button -->
        <button class="vibe-toolbar-btn vibe-main-btn" style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          color: white;
          font-size: 16px;
          position: relative;
          flex-shrink: 0;
        ">
          \u{1F4AC}
          ${this.data.commentCount > 0 ? `
            <div class="vibe-toolbar-badge">${this.formatCount(this.data.commentCount)}</div>
          ` : ""}
        </button>

        <!-- Expanded Content -->
        <div class="vibe-toolbar-content" style="
          display: ${isCollapsed ? "none" : "flex"};
          align-items: center;
          gap: 12px;
          color: white;
          min-width: 0;
          flex: 1;
        ">
          <!-- Comments Summary -->
          <div class="vibe-comments-summary" style="
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
            flex: 1;
          ">
            <div style="font-size: 12px; font-weight: 600;">
              ${this.data.commentCount} comment${this.data.commentCount !== 1 ? "s" : ""}
            </div>
            <div style="font-size: 10px; opacity: 0.8;">
              ${this.data.activeComments} active \u2022 ${this.data.previewComments} preview \u2022 ${this.data.deployedComments} deployed
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 6px; flex-shrink: 0;">
            <!-- User Avatar -->
            ${this.config.user ? `
              <button class="vibe-toolbar-btn" title="User Settings" style="
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                overflow: hidden;
                color: white;
                font-size: 12px;
              ">
                ${this.config.user.avatarUrl ? `
                  <img src="${this.config.user.avatarUrl}" style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  " />
                ` : this.getInitials(this.config.user.email)}
              </button>
            ` : ""}

            <!-- Settings -->
            <button class="vibe-toolbar-btn vibe-settings-btn" title="Settings" style="
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.1);
              color: white;
              font-size: 12px;
            ">
              \u2699\uFE0F
            </button>

            <!-- Close -->
            <button class="vibe-toolbar-btn vibe-close-btn" title="Close" style="
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.1);
              color: white;
              font-size: 12px;
              line-height: 1;
            ">
              \xD7
            </button>
          </div>
        </div>
      </div>
    `;
    this.attachButtonListeners();
  }
  attachButtonListeners() {
    if (!this.toolbar) return;
    const mainBtn = this.toolbar.querySelector(".vibe-main-btn");
    mainBtn?.addEventListener("click", () => {
      if (!this.isExpanded) {
        this.expand();
      } else {
        this.openCommentsList();
      }
    });
    const settingsBtn = this.toolbar.querySelector(".vibe-settings-btn");
    settingsBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openSettings();
    });
    const closeBtn = this.toolbar.querySelector(".vibe-close-btn");
    closeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.hide();
    });
    const userBtn = this.toolbar.querySelector('.vibe-toolbar-btn[title="User Settings"]');
    userBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openUserSettings();
    });
  }
  attachEventListeners() {
    document.addEventListener("click", this.handleOutsideClick.bind(this));
    window.addEventListener("vibe:commentsUpdated", this.handleCommentsUpdated.bind(this));
    window.addEventListener("vibe:openCommentsList", this.openCommentsList.bind(this));
  }
  removeEventListeners() {
    document.removeEventListener("click", this.handleOutsideClick.bind(this));
    window.removeEventListener("vibe:commentsUpdated", this.handleCommentsUpdated.bind(this));
    window.removeEventListener("vibe:openCommentsList", this.openCommentsList.bind(this));
  }
  handleOutsideClick(event) {
    if (!this.toolbar || !this.isExpanded) return;
    const target = event.target;
    if (!this.toolbar.contains(target)) {
      this.collapse();
    }
  }
  async handleCommentsUpdated() {
    await this.loadData();
    this.renderToolbar();
  }
  async loadData() {
    try {
      const { data: comments, error } = await this.supabase.from("comments").select(`
          id,
          status,
          page_path,
          created_at
        `).eq("project_id", this.config.projectId);
      if (error) throw error;
      const total = comments?.length || 0;
      const active = comments?.filter((c) => !c.status || c.status === "active").length || 0;
      const preview = comments?.filter((c) => c.status === "preview").length || 0;
      const deployed = comments?.filter((c) => c.status === "deployed").length || 0;
      this.data = {
        commentCount: total,
        activeComments: active,
        previewComments: preview,
        deployedComments: deployed
      };
    } catch (error) {
      console.error("Error loading toolbar data:", error);
    }
  }
  expand() {
    this.isExpanded = true;
    this.renderToolbar();
  }
  collapse() {
    this.isExpanded = false;
    this.renderToolbar();
  }
  openCommentsList() {
    const event = new CustomEvent("vibe:openCommentsList", {
      detail: { projectId: this.config.projectId }
    });
    window.dispatchEvent(event);
  }
  openSettings() {
    const event = new CustomEvent("vibe:openSettings", {
      detail: { projectId: this.config.projectId }
    });
    window.dispatchEvent(event);
  }
  openUserSettings() {
    const event = new CustomEvent("vibe:openUserSettings", {
      detail: { user: this.config.user }
    });
    window.dispatchEvent(event);
  }
  show() {
    if (!this.toolbar || this.isVisible) return;
    this.isVisible = true;
    this.toolbar.classList.add("vibe-toolbar-visible");
  }
  hide() {
    if (!this.toolbar || !this.isVisible) return;
    this.isVisible = false;
    this.toolbar.classList.remove("vibe-toolbar-visible");
    setTimeout(() => {
      if (this.toolbar && !this.isVisible) {
        this.toolbar.style.display = "none";
      }
    }, 300);
  }
  // Helper methods
  formatCount(count) {
    if (count > 99) return "99+";
    return count.toString();
  }
  getInitials(email) {
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  }
  // Public methods
  updateConfig(config) {
    this.config = { ...this.config, ...config };
    this.renderToolbar();
  }
  async refresh() {
    await this.loadData();
    this.renderToolbar();
  }
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
  isToolbarVisible() {
    return this.isVisible;
  }
  getData() {
    return { ...this.data };
  }
};

// src/commentList.ts
var CommentListModule = class {
  constructor(supabase, config) {
    this.comments = [];
    this.filteredComments = [];
    this.currentFilter = "all";
    this.isVisible = false;
    this.supabase = supabase;
    this.config = config;
  }
  async show() {
    if (this.isVisible) return;
    await this.loadComments();
    this.createModal();
    this.renderComments();
    this.attachEventListeners();
    this.isVisible = true;
  }
  hide() {
    if (!this.isVisible) return;
    if (this.modal) {
      document.body.removeChild(this.modal);
      this.modal = void 0;
    }
    this.removeEventListeners();
    this.isVisible = false;
  }
  async loadComments() {
    try {
      const { data: comments, error } = await this.supabase.from("comments").select(`
          id,
          content,
          status,
          page_path,
          element_selector,
          branch_name,
          pr_url,
          preview_url,
          created_at,
          created_by,
          metadata,
          profiles!created_by (
            email,
            full_name
          )
        `).eq("project_id", this.config.projectId).order("created_at", { ascending: false });
      if (error) throw error;
      this.comments = (comments || []).map((comment) => {
        const profile = comment.profiles;
        return {
          ...comment,
          status: comment.status || "active",
          author_name: profile?.full_name,
          author_email: profile?.email,
          // TODO: Load approval counts from comment_approvals table
          approval_count: 0,
          required_approvals: 1
        };
      });
      this.applyFilter(this.currentFilter);
    } catch (error) {
      console.error("Error loading comments:", error);
      this.comments = [];
      this.filteredComments = [];
    }
  }
  createModal() {
    this.modal = document.createElement("div");
    this.modal.id = "vibe-comment-list-modal";
    this.modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
      opacity: 0;
      animation: fadeIn 0.2s ease-out forwards;
    `;
    if (!document.getElementById("vibe-comment-list-styles")) {
      this.addStyles();
    }
    const modalContent = document.createElement("div");
    modalContent.className = "vibe-modal-content";
    modalContent.style.cssText = `
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      transform: scale(0.95) translateY(20px);
      animation: slideIn 0.3s ease-out forwards;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    const header = this.createHeader();
    modalContent.appendChild(header);
    const filters = this.createFilters();
    modalContent.appendChild(filters);
    const listContainer = document.createElement("div");
    listContainer.className = "vibe-comment-list-container";
    listContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 0 24px 24px 24px;
    `;
    const commentsList = document.createElement("div");
    commentsList.className = "vibe-comments-list";
    commentsList.id = "vibe-comments-list";
    listContainer.appendChild(commentsList);
    modalContent.appendChild(listContainer);
    this.modal.appendChild(modalContent);
    document.body.appendChild(this.modal);
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });
  }
  addStyles() {
    const styles = document.createElement("style");
    styles.id = "vibe-comment-list-styles";
    styles.textContent = `
      @keyframes fadeIn {
        to { opacity: 1; }
      }

      @keyframes slideIn {
        to {
          transform: scale(1) translateY(0);
        }
      }

      .vibe-comment-item {
        transition: all 0.2s ease;
      }

      .vibe-comment-item:hover {
        background: #f8fafc !important;
        border-color: #e2e8f0 !important;
      }

      .vibe-filter-btn {
        transition: all 0.2s ease;
      }

      .vibe-filter-btn:hover {
        background: #f1f5f9;
      }

      .vibe-filter-btn.active {
        background: #3b82f6;
        color: white;
      }

      .vibe-action-btn {
        transition: all 0.2s ease;
      }

      .vibe-action-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .vibe-status-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .vibe-status-active {
        color: #059669;
        background: #d1fae5;
      }

      .vibe-status-preview {
        color: #d97706;
        background: #fef3c7;
      }

      .vibe-status-deployed {
        color: #7c3aed;
        background: #ede9fe;
      }
    `;
    document.head.appendChild(styles);
  }
  createHeader() {
    const header = document.createElement("div");
    header.style.cssText = `
      padding: 24px 24px 16px 24px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `;
    const title = document.createElement("h2");
    title.textContent = "Comments";
    title.style.cssText = `
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #111827;
    `;
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "\xD7";
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      color: #6b7280;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    `;
    closeBtn.addEventListener("click", () => this.hide());
    header.appendChild(title);
    header.appendChild(closeBtn);
    return header;
  }
  createFilters() {
    const filters = document.createElement("div");
    filters.style.cssText = `
      padding: 16px 24px;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    `;
    const filterTitle = document.createElement("div");
    filterTitle.textContent = "Filter by status:";
    filterTitle.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 12px;
    `;
    const filterButtons = document.createElement("div");
    filterButtons.style.cssText = `
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    `;
    const filterOptions = [
      { key: "all", label: "All", icon: "\u{1F4CB}" },
      { key: "active", label: "Active", icon: "\u{1F7E2}" },
      { key: "preview", label: "Preview", icon: "\u{1F441}" },
      { key: "deployed", label: "Deployed", icon: "\u2705" }
    ];
    filterOptions.forEach((option) => {
      const btn = document.createElement("button");
      btn.className = `vibe-filter-btn ${option.key === this.currentFilter ? "active" : ""}`;
      btn.style.cssText = `
        padding: 8px 16px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: ${option.key === this.currentFilter ? "#3b82f6" : "white"};
        color: ${option.key === this.currentFilter ? "white" : "#374151"};
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
      `;
      btn.innerHTML = `${option.icon} ${option.label}`;
      btn.addEventListener("click", () => {
        this.setFilter(option.key);
        this.updateFilterButtons();
        this.renderComments();
      });
      filterButtons.appendChild(btn);
    });
    filters.appendChild(filterTitle);
    filters.appendChild(filterButtons);
    return filters;
  }
  updateFilterButtons() {
    if (!this.modal) return;
    const buttons = this.modal.querySelectorAll(".vibe-filter-btn");
    buttons.forEach((btn, index) => {
      const option = ["all", "active", "preview", "deployed"][index];
      const isActive = option === this.currentFilter;
      btn.className = `vibe-filter-btn ${isActive ? "active" : ""}`;
      btn.style.background = isActive ? "#3b82f6" : "white";
      btn.style.color = isActive ? "white" : "#374151";
    });
  }
  renderComments() {
    const listElement = document.getElementById("vibe-comments-list");
    if (!listElement) return;
    if (this.filteredComments.length === 0) {
      listElement.innerHTML = `
        <div style="
          text-align: center;
          padding: 48px 24px;
          color: #6b7280;
        ">
          <div style="font-size: 48px; margin-bottom: 16px;">\u{1F4AC}</div>
          <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">
            No comments found
          </div>
          <div style="font-size: 14px;">
            ${this.currentFilter === "all" ? "Start by adding a comment to any element on the page." : `No ${this.currentFilter} comments yet.`}
          </div>
        </div>
      `;
      return;
    }
    listElement.innerHTML = this.filteredComments.map((comment) => this.renderComment(comment)).join("");
  }
  renderComment(comment) {
    const relativeTime = this.formatRelativeTime(comment.created_at);
    const truncatedContent = this.truncateText(comment.content, 120);
    const statusBadge = this.renderStatusBadge(comment.status);
    return `
      <div class="vibe-comment-item" style="
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
        background: white;
        cursor: pointer;
      " data-comment-id="${comment.id}">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            ${statusBadge}
            ${comment.page_path ? `
              <span style="
                background: #f3f4f6;
                color: #374151;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11px;
                font-family: monospace;
              ">${comment.page_path}</span>
            ` : ""}
          </div>
          <div style="font-size: 12px; color: #6b7280;">
            ${relativeTime}
          </div>
        </div>

        <!-- Content -->
        <div style="margin-bottom: 12px;">
          <p style="
            margin: 0;
            color: #111827;
            font-size: 14px;
            line-height: 1.5;
          ">${truncatedContent}</p>
        </div>

        <!-- Author -->
        <div style="
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 12px;
        ">
          By ${comment.author_name || comment.author_email || "Unknown"}
        </div>

        <!-- Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 8px;">
            ${this.renderCommentActions(comment)}
          </div>

          ${comment.approval_count !== void 0 && comment.required_approvals ? `
            <div style="
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 12px;
              color: #6b7280;
            ">
              <span>${comment.approval_count}/${comment.required_approvals} approved</span>
              ${this.renderApprovalDots(comment.approval_count, comment.required_approvals)}
            </div>
          ` : ""}
        </div>
      </div>
    `;
  }
  renderStatusBadge(status) {
    const statusConfig = {
      active: { icon: "\u{1F7E2}", label: "Active" },
      preview: { icon: "\u{1F441}", label: "Preview" },
      deployed: { icon: "\u2705", label: "Deployed" }
    };
    const config = statusConfig[status];
    return `
      <span class="vibe-status-badge vibe-status-${status}" style="
        padding: 4px 8px;
        border-radius: 4px;
      ">
        ${config.icon} ${config.label}
      </span>
    `;
  }
  renderCommentActions(comment) {
    const actions = [];
    actions.push(`
      <button class="vibe-action-btn" data-action="view" data-comment-id="${comment.id}" style="
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        color: #374151;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
      ">View</button>
    `);
    if (comment.status === "preview") {
      if (comment.preview_url) {
        actions.push(`
          <a href="${comment.preview_url}" target="_blank" class="vibe-action-btn" style="
            background: #3b82f6;
            border: 1px solid #3b82f6;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            text-decoration: none;
            display: inline-block;
          ">Preview</a>
        `);
      }
      actions.push(`
        <button class="vibe-action-btn" data-action="approve" data-comment-id="${comment.id}" style="
          background: #10b981;
          border: 1px solid #10b981;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        ">Approve</button>
      `);
      actions.push(`
        <button class="vibe-action-btn" data-action="request-changes" data-comment-id="${comment.id}" style="
          background: #ef4444;
          border: 1px solid #ef4444;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        ">Request Changes</button>
      `);
    }
    if (comment.status === "deployed") {
      actions.push(`
        <button class="vibe-action-btn" data-action="rollback" data-comment-id="${comment.id}" style="
          background: #ef4444;
          border: 1px solid #ef4444;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        ">Rollback</button>
      `);
    }
    actions.push(`
      <button class="vibe-action-btn" data-action="reply" data-comment-id="${comment.id}" style="
        background: #f59e0b;
        border: 1px solid #f59e0b;
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
      ">Reply</button>
    `);
    return actions.join("");
  }
  renderApprovalDots(current, required) {
    const dots = [];
    for (let i = 0; i < required; i++) {
      const filled = i < current;
      dots.push(`
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${filled ? "#10b981" : "#d1d5db"};
        "></div>
      `);
    }
    return `<div style="display: flex; gap: 2px;">${dots.join("")}</div>`;
  }
  attachEventListeners() {
    if (!this.modal) return;
    this.modal.addEventListener("click", (e) => {
      const target = e.target;
      const action = target.getAttribute("data-action");
      const commentId = target.getAttribute("data-comment-id");
      if (action && commentId) {
        e.preventDefault();
        e.stopPropagation();
        this.handleCommentAction(action, commentId);
        return;
      }
      const commentItem = target.closest(".vibe-comment-item");
      if (commentItem) {
        const id = commentItem.getAttribute("data-comment-id");
        if (id) {
          this.handleCommentAction("view", id);
        }
      }
    });
    window.addEventListener("vibe:commentUpdated", this.handleCommentUpdated.bind(this));
  }
  removeEventListeners() {
    window.removeEventListener("vibe:commentUpdated", this.handleCommentUpdated.bind(this));
  }
  async handleCommentUpdated() {
    await this.loadComments();
    this.renderComments();
  }
  handleCommentAction(action, commentId) {
    const comment = this.comments.find((c) => c.id === commentId);
    if (!comment) return;
    switch (action) {
      case "view":
        this.viewComment(comment);
        break;
      case "approve":
        this.approveComment(comment);
        break;
      case "request-changes":
        this.requestChanges(comment);
        break;
      case "rollback":
        this.rollbackComment(comment);
        break;
      case "reply":
        this.replyToComment(comment);
        break;
    }
  }
  viewComment(comment) {
    this.hide();
    if (comment.page_path && comment.page_path !== window.location.pathname) {
      window.location.href = comment.page_path;
      return;
    }
    const event = new CustomEvent("vibe:openComment", {
      detail: { commentId: comment.id }
    });
    window.dispatchEvent(event);
  }
  approveComment(comment) {
    const event = new CustomEvent("vibe:approveComment", {
      detail: { commentId: comment.id, approved: true }
    });
    window.dispatchEvent(event);
  }
  requestChanges(comment) {
    const event = new CustomEvent("vibe:approveComment", {
      detail: { commentId: comment.id, approved: false }
    });
    window.dispatchEvent(event);
  }
  rollbackComment(comment) {
    const event = new CustomEvent("vibe:rollbackComment", {
      detail: { commentId: comment.id }
    });
    window.dispatchEvent(event);
  }
  replyToComment(comment) {
    const event = new CustomEvent("vibe:replyToComment", {
      detail: { commentId: comment.id }
    });
    window.dispatchEvent(event);
  }
  applyFilter(filter) {
    this.currentFilter = filter;
    if (filter === "all") {
      this.filteredComments = [...this.comments];
    } else {
      this.filteredComments = this.comments.filter((comment) => comment.status === filter);
    }
  }
  setFilter(filter) {
    this.applyFilter(filter);
  }
  // Utility methods
  formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - date.getTime();
    const seconds = Math.floor(diffMs / 1e3);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }
  // Public methods
  async refresh() {
    await this.loadComments();
    this.renderComments();
  }
  isModalVisible() {
    return this.isVisible;
  }
  getComments() {
    return [...this.comments];
  }
  getFilteredComments() {
    return [...this.filteredComments];
  }
  getCurrentFilter() {
    return this.currentFilter;
  }
};

// src/index.ts
var VibeInstance = class {
  constructor(config) {
    this.isActive = false;
    this.config = config;
    this.supabase = (0, import_supabase_js.createClient)(config.supabaseUrl, config.supabaseAnonKey);
    this.auth = new AuthModule(this.supabase, config.user);
    this.overlay = new OverlayModule(this.supabase, config.projectId);
  }
  async activate() {
    if (this.isActive) return;
    if (!this.config.user) {
      const isAuthenticated = await this.auth.checkAuth();
      if (!isAuthenticated) {
        await this.auth.showLoginModal();
        return;
      }
    }
    await this.overlay.init();
    this.toolbar = new ToolbarModule(this.supabase, {
      position: "bottom-right",
      user: this.config.user,
      projectId: this.config.projectId
    });
    await this.toolbar.init();
    this.commentList = new CommentListModule(this.supabase, {
      projectId: this.config.projectId,
      currentUser: this.config.user
    });
    this.setupEventHandlers();
    this.isActive = true;
  }
  destroy() {
    if (this.overlay) {
      this.overlay.destroy();
    }
    if (this.toolbar) {
      this.toolbar.destroy();
    }
    if (this.commentList) {
      this.commentList.hide();
    }
    this.isActive = false;
  }
  setupEventHandlers() {
    window.addEventListener("vibe:openCommentsList", () => {
      if (this.commentList) {
        this.commentList.show();
      }
    });
    window.addEventListener("vibe:commentUpdated", () => {
      if (this.toolbar) {
        this.toolbar.refresh();
      }
    });
  }
  getSupabaseClient() {
    return this.supabase;
  }
  getToolbar() {
    return this.toolbar;
  }
  getCommentList() {
    return this.commentList;
  }
};
function initVibe(config) {
  const instance = new VibeInstance(config);
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("agentic") === "true") {
      instance.activate().catch(console.error);
    }
  }
  return instance;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthModule,
  CommentListModule,
  OverlayModule,
  PreviewModule,
  ToolbarModule,
  VibeInstance,
  blobToDataURL,
  captureElementScreenshot,
  captureMetadata,
  initVibe,
  uploadScreenshot
});
//# sourceMappingURL=index.js.map