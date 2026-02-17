use tauri::{
    image::Image,
    menu::{MenuBuilder, MenuItemBuilder},
    tray::TrayIconBuilder,
    Emitter, Manager,
};

#[tauri::command]
fn get_screen_size(window: tauri::Window) -> (f64, f64) {
    if let Ok(monitor) = window.current_monitor() {
        if let Some(monitor) = monitor {
            let size = monitor.size();
            let scale = monitor.scale_factor();
            return (size.width as f64 / scale, size.height as f64 / scale);
        }
    }
    (1920.0, 1080.0)
}

#[tauri::command]
fn set_position(window: tauri::Window, x: f64, y: f64) {
    let _ = window.set_position(tauri::Position::Logical(tauri::LogicalPosition::new(x, y)));
}

#[tauri::command]
fn set_size(window: tauri::Window, width: f64, height: f64) {
    let _ = window.set_size(tauri::Size::Logical(tauri::LogicalSize::new(width, height)));
}

#[tauri::command]
fn set_ignore_cursor_events(window: tauri::Window, ignore: bool) {
    let _ = window.set_ignore_cursor_events(ignore);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            // Build tray menu
            let quit = MenuItemBuilder::with_id("quit", "Quit Chill").build(app)?;
            let show = MenuItemBuilder::with_id("show", "Show/Hide").build(app)?;
            let about = MenuItemBuilder::with_id("about", "About").build(app)?;
            let sleep = MenuItemBuilder::with_id("sleep", "Toggle Sleep").build(app)?;

            let menu = MenuBuilder::new(app)
                .items(&[&show, &sleep, &about, &quit])
                .build()?;

            let tray_icon = Image::from_path("../assets/sprites/sprite-idle-128.png")
                .unwrap_or_else(|_| Image::from_bytes(include_bytes!("../../assets/sprites/sprite-idle-128.png")).expect("failed to load tray icon"));

            let _tray = TrayIconBuilder::new()
                .icon(tray_icon)
                .menu(&menu)
                .tooltip("Chill the Ice Slime")
                .on_menu_event(move |app, event| match event.id().as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_visible().unwrap_or(false) {
                                let _ = window.hide();
                            } else {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                    "about" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.emit("tray-about", ());
                        }
                    }
                    "sleep" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.emit("tray-toggle-sleep", ());
                        }
                    }
                    _ => {}
                })
                .build(app)?;

            // Position window at bottom of screen
            if let Some(window) = app.get_webview_window("main") {
                if let Ok(Some(monitor)) = window.current_monitor() {
                    let size = monitor.size();
                    let scale = monitor.scale_factor();
                    let screen_w = size.width as f64 / scale;
                    let screen_h = size.height as f64 / scale;
                    let _ = window.set_position(tauri::Position::Logical(
                        tauri::LogicalPosition::new(screen_w / 2.0 - 100.0, screen_h - 200.0),
                    ));
                }
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_screen_size,
            set_position,
            set_size,
            set_ignore_cursor_events,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
