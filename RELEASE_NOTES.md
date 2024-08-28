# Giblog Jekyll Project Release Notes

## Version 1.0.1

Release Date: [2024-08-28]

### Major Changes

- **Added Multilingual Support**: Implemented page separation for Korean and English using the jekyll-polyglot gem.
  - Users can now view content optimized for their language preference.
  - Supported languages: Korean, English

### Technical Details

- **Gem Used**: jekyll-polyglot
- **Gem Version**: 

### Installation and Upgrade Instructions

1. Add the following line to your Gemfile:
   ```ruby
   gem 'jekyll-polyglot'
   ```
2. Run the following command in your terminal:
   ```
   bundle install
   ```
3. Update your `_config.yml` file to include jekyll-polyglot settings.

--------------------------------------------------------------