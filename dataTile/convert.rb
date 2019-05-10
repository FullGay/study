z = 0
print "directory name:"
dir = gets.chomp
while z <= 4
    (2**z).times do |x|
        (2**z).times do |y|
            system("convert #{dir}/#{z}/#{x}/#{y}.txt #{dir}/#{z}/#{x}/#{y}.png")
            y += 1  
       end
       x += 1
    end
    z += 1
end
