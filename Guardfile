# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'slim', :input_root => 'slim', :output_root => 'public', :slim => { :pretty => true } do
  watch(%r'^.+\.slim$')
end

guard 'sass', :input => 'sass', :output => 'public/css'

guard 'coffeescript', :input => 'coffee', :output => 'public/js'

