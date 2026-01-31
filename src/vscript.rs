use std::fs;
use zed::LanguageServerId;
use zed_extension_api::{self as zed, CodeLabel, CodeLabelSpanLiteral};

use crate::error;

struct Extension {
    current_version: String,
    /// We try to c&ache the path
    cached_bin_path: Option<String>,
}

fn try_local_lsp_installation<T: std::fmt::Debug + std::fmt::Display>(
    err: T,
    wtree: &zed::Worktree,
) -> zed::Result<String> {
    if let Some(path) = wtree.which("vslp") {
        return Ok(path);
    }
    Err(error::Error::InstallVslp(err).to_string())
}

fn language_server_bin_path(
    // Equivalent of the `self` keyword but for `Extension` struct
    ext: &mut Extension,
    language_server_id: &LanguageServerId,
    wtree: &zed::Worktree,
) -> zed::Result<String> {
    if let Some(cache) = ext.cached_bin_path.clone() {
        if let Some(local) = wtree.which("vslp") {
            if local != cache && fs::metadata(&cache).is_ok_and(|stat| stat.is_file()) {
                return Ok(cache);
            }
        } else {
            return Ok(cache);
        }
    };

    let (platform, arch) = zed::current_platform();
    zed::set_language_server_installation_status(
        language_server_id,
        &zed::LanguageServerInstallationStatus::CheckingForUpdate,
    );

    let asset_name = format!(
        "vslp-{os}-{arch}{extension}",
        arch = match arch {
            zed::Architecture::Aarch64 => "arm64",
            zed::Architecture::X86 => "x86",
            zed::Architecture::X8664 => "x86_64",
        },
        os = match platform {
            zed::Os::Mac => "darwin",
            zed::Os::Linux => "linux",
            zed::Os::Windows => "windows",
        },
        extension = match platform {
            zed::Os::Windows => ".exe",
            _ => "",
        },
    );

    let release = zed::latest_github_release(
        "m-epasta/vslp",
        zed::GithubReleaseOptions {
            require_assets: true,
            pre_release: false,
        },
    )?;

    let asset = release
        .assets
        .iter()
        .find(|asset| asset.name == asset_name)
        .ok_or_else(|| format!("no asset found matching {:?}", asset_name))?;

    if ext.current_version != asset.download_url
        || !fs::metadata(&asset_name).map_or(false, |stat| stat.is_file())
    {
        zed::set_language_server_installation_status(
            &language_server_id,
            &zed::LanguageServerInstallationStatus::Downloading,
        );

        zed::download_file(
            &asset.download_url,
            &asset_name,
            zed::DownloadedFileType::Uncompressed,
        )
        .map_err(|err| format!("failed to download file: {}", err))?;

        zed::make_file_executable(&asset_name)?;

        let entries = fs::read_dir(".")
            .map_err(|err| format!("failed to list working directory: {}", err))?;
        for entry in entries {
            let entry = entry.map_err(|err| format!("failed to load directory entry: {}", err))?;
            if entry.file_name().to_str() != Some(&asset_name) {
                fs::remove_dir_all(&entry.path()).ok();
            }
        }
    }

    ext.cached_bin_path = Some(asset_name.clone());
    ext.current_version = release.version.clone();

    Ok(asset_name)
}

impl Extension {
    fn vslp_path(
        &mut self,
        language_server_id: &LanguageServerId,
        wtree: &zed::Worktree,
    ) -> zed::Result<String> {
        return language_server_bin_path(self, language_server_id, wtree)
            .or_else(|err| try_local_lsp_installation(err, wtree));
    }
}

impl zed::Extension for Extension {
    fn new() -> Self {
        Self {
            cached_bin_path: None,
            current_version: String::new(),
        }
    }

    fn language_server_command(
        &mut self,
        language_server_id: &LanguageServerId,
        wtree: &zed::Worktree,
    ) -> zed::Result<zed::Command> {
        Ok(zed::Command {
            command: self.vslp_path(language_server_id, wtree)?,
            args: vec![],
            env: Default::default(),
        })
    }

    fn label_for_completion(
        &self,
        _language_server_id: &LanguageServerId,
        completion: zed::lsp::Completion,
    ) -> Option<zed::CodeLabel> {
        let (highlight_name, label) = match completion.kind {
            Some(zed::lsp::CompletionKind::Struct) => ("type", completion.label),
            Some(zed::lsp::CompletionKind::Interface) => ("type", completion.label),
            Some(zed::lsp::CompletionKind::Function) => ("function", completion.label),
            Some(zed::lsp::CompletionKind::Method) => ("function", completion.label),
            _ => ("identifier", completion.label),
        };

        Some(CodeLabel {
            spans: vec![
                Some(zed::CodeLabelSpan::Literal(CodeLabelSpanLiteral {
                    text: label.to_string(),
                    highlight_name: Some(String::from(highlight_name)),
                })),
                completion.detail.map(|detail| {
                    zed::CodeLabelSpan::Literal(CodeLabelSpanLiteral {
                        text: detail,
                        highlight_name: Some(String::from("type")),
                    })
                }),
            ]
            .into_iter()
            .flatten()
            .collect(),
            filter_range: (0..label.len()).into(),
            code: label,
        })
    }
}

// fn after_first(in_string: &str, delimiter: char) -> Option<String> {
//     let mut splitter = in_string.splitn(2, delimiter);
//     splitter.next()?;
//     Some(splitter.next()?.to_string())
// }

zed::register_extension!(Extension);
