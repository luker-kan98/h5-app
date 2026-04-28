Pod::Spec.new do |s|
  s.name         = 'AppVueSDK'
  s.version      = '1.0.0'
  s.summary      = 'AppVue attribution and analytics SDK'
  s.homepage     = 'https://appvue.com'
  s.license      = { :type => 'Commercial' }
  s.author       = 'AppVue'
  s.platform     = :ios, '13.0'
  s.source       = { :path => '.' }
  s.vendored_frameworks = 'Frameworks/AppVueSDK.xcframework'
end
