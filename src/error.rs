use std::fmt;
use thiserror::*;

#[derive(Error)]
pub enum Error<T: fmt::Debug + std::fmt::Display> {
    #[error("Failed to load extension: {0}")]
    LoadExtension(String),
    #[error("Failed to initialize extension: {0}")]
    InitExtension(String),
    #[error("Failed to execute extension: {0}")]
    ExecuteExtension(String),
    #[error("Failed to install vslp: {0}")]
    InstallVslp(T),
}
